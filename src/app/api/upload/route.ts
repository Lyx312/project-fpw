import { NextRequest, NextResponse } from "next/server";
import path from "path";
// import fs from "fs";
import { put } from '@vercel/blob'

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as File) || null;
  const type = body.type as string || "default";

  if (!type) {
    console.log("Type is required");
    return NextResponse.json({
      success: false,
    });
  }

  // const UPLOAD_DIR = path.normalize(path.join(process.cwd(), "public", type));
  // console.log("UPLOAD_DIR", UPLOAD_DIR);

  if (file) {
    // const buffer = Buffer.from(await file.arrayBuffer());

    // Ensure upload directory exists
    // if (!fs.existsSync(UPLOAD_DIR)) {
    //   fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    // }

    // Safely extract file name
    const fileName = path.basename((body.file as File).name);

    // Save the file to the designated directory
    // const filePath = path.resolve(UPLOAD_DIR, fileName);
    // fs.writeFileSync(filePath, buffer);

    // Upload the file to Vercel Blob Storage
    const blob = await put(`${type}/${fileName}`, file, {
      access: "public",
    });

    console.log("File uploaded successfully");

    // return NextResponse.json({
    //   success: true,
    //   path: `/${type}/${fileName}`,
    // });

    return NextResponse.json({
      success: true,
      path: `/${type}/${fileName}`,
      blob,
    });

  } else {
    console.error("Error uploading file");
    return NextResponse.json({
      success: false,
    });
  }
};
