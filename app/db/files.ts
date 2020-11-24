import { extractFileDetail, FileData, FileDetail, files } from "../db.js";
import { generateRandomBytes, Result } from "../utils.js";
import { promises as fs } from 'fs';
import { FILE_NOT_FOUND } from "../errors.js";

async function getNewFileId() {
  let fid = generateRandomBytes(16);
  while (await files.findOne({ fid })) {
    fid = generateRandomBytes(16);
  }
  return fid;
}

export async function saveFile(username: string, filename: string, buffer: Buffer): Promise<Result<string, string>> {
  const fid = await getNewFileId();
  const filepath = `uploads/${fid}`;

  await files.insertOne({
    fid,
    uploader: username,
    size: buffer.length,
    filename,
    filepath,
  });
  await fs.writeFile(filepath, buffer);

  return Result.ok(fid);
}

export async function getFileData(fid: string): Promise<Result<FileData, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  return Result.ok(result);
}
export async function getFileDetail(fid: string): Promise<Result<FileDetail, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  return Result.ok(extractFileDetail(result));
}

export async function deleteFile(fid: string): Promise<Result<void, string>> {
  const result = await files.findOne({ fid });
  if (!result) return Result.error(FILE_NOT_FOUND);
  await fs.unlink(result.filepath);
  await files.deleteOne(result);
  return Result.ok();
}
