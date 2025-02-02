import mutagen
import os
import sys

def get_thumbnail(mp3_file, output_image):
    if os.path.exists(mp3_file):
        audio = mutagen.File(mp3_file)
        if audio and 'APIC:' in audio.tags:
            for tag in audio.tags:
                if tag.startswith('APIC:'):
                    with open(output_image, 'wb') as img_file:
                        img_file.write(audio.tags[tag].data)
                    return True
    return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_thumbnail.py <mp3_file> <output_image>")
        sys.exit(1)

    mp3_file_path = sys.argv[1]
    output_image_path = sys.argv[2]

    if get_thumbnail(mp3_file_path, output_image_path):
        print(f"Thumbnail extracted to {output_image_path}")
    else:
        print("No thumbnail found or file does not exist.")
