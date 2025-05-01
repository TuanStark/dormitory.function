import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_KEY || '',
    );
  }

  /**
   * Upload a file to Supabase Storage
   * @param file Base64 encoded file content
   * @param bucket Bucket name in Supabase Storage
   * @param path Path inside the bucket (e.g., 'rooms/123')
   * @param filename Name of the file with extension
   * @returns URL of the uploaded file
   */
  async uploadFile(
    file: string,
    bucket: string,
    path: string,
    filename: string,
  ): Promise<string> {
    try {
      // Convert base64 to buffer (remove 'data:image/jpeg;base64,' part if present)
      const base64Data = file.includes('base64,') 
        ? file.split('base64,')[1] 
        : file;
      
      const buffer = Buffer.from(base64Data, 'base64');

      // Upload file to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(`${path}/${filename}`, buffer, {
          contentType: this.getContentType(filename),
          upsert: true,
        });

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Get public URL for the uploaded file
      const { data: urlData } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(`${path}/${filename}`);

      return urlData.publicUrl;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  /**
   * Get content type based on file extension
   * @param filename File name with extension
   * @returns Content type
   */
  private getContentType(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Delete a file from Supabase Storage
   * @param bucket Bucket name in Supabase Storage
   * @param path Full path to the file including filename
   */
  async deleteFile(bucket: string, path: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        throw new Error(`Error deleting file: ${error.message}`);
      }
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}
