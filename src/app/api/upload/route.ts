import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const body = Object.fromEntries(formData);
  const file = (body.file as Blob) || null;
  const type = body.type as string || "default";

  if (!type) {
    console.log("Type is required");
    return NextResponse.json({
      success: false,
    });
  }

  const UPLOAD_DIR = path.resolve(`public/${type}`);

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    fs.writeFileSync(
      path.resolve(UPLOAD_DIR, (body.file as File).name),
      buffer
    );
  } else {
    console.error("error uploading file");
    return NextResponse.json({
      success: false,
    });
  }
  console.error("file uploaded successfully");
  return NextResponse.json({
    success: true,
    name: (body.file as File).name,
  });
};