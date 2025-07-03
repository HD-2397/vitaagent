/** @format */

import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

// Disable body parsing for formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { files }: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = file.originalFilename || "unknown_file.pdf";
    const fileSizeKB = Math.round(file.size / 1024);
    const buffer = fs.readFileSync(file.filepath);

    const content =
      file.mimetype === "application/pdf"
        ? (await pdfParse(buffer)).text
        : buffer.toString("utf-8");

    // Initialize Supabase client
    // create
    const supabase = createPagesServerClient({ req, res });

    // Get user ID
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const filePath = `${user.id}/${fileName}`;

    // Upload file to Supabase Storage ( bucket: resumes )
    // Every file is stored in a folder named after the user's ID,
    // so that users can only access their own files according to the policies defined in the Supabase
    // storage bucket.
    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      return res
        .status(500)
        .json({
          error: `Failed to upload file to storage: ${uploadError.message}`,
        });
    }
    // Insert metadata into `resume_uploads` table
    const { error: insertError } = await supabase
      .from("resume_uploads")
      .insert([
        {
          file_name: fileName,
          file_size_kb: fileSizeKB,
          parsed_text: content,
          supabase_path: filePath, // for reference
          uploaded_at: new Date().toISOString(),
          // user_id will be auto-filled by Supabase default `auth.uid()`
        },
      ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({ error: "Failed to save resume metadata" });
    }

    return res.status(200).json({
      message: "Resume uploaded and parsed successfully",
      fileName,
      content,
      supabasePath: filePath,
    });
  } catch (err) {
    console.error("Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
