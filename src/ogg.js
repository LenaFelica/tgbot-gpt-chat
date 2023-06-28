import axios from "axios";
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { createWriteStream } from 'fs';
import { dirname, resolve} from 'path';
import { fileURLToPath } from 'url';
import { removeFile } from "./utils.js";

//* абсолютный путь к каталогу:
const __dirname = dirname(fileURLToPath(import.meta.url))

class OggConverter {
    constructor() {
      ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input, output) {
       try {
         const outputPath = resolve(dirname(input), `${output}.mp3`)
         return new Promise((resolve, reject) => {
              ffmpeg(input)
                .inputOptions('-t 30')
                .output(outputPath) //выходной файл
                .on('end', () => {
                  removeFile(input) // ogg удаляем
                  resolve(outputPath) // путь до мп3
               }) 
                .on('error', err => reject(err.message))
                .run() //запуск
       })
      } catch (e) {
         console.log('Error whle creating mp3' , e.message)
       }
    }

    async create(url, filename) {
      try {
         const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)
         const response = await axios({
            method: 'get',
            url,
            responseType: 'stream',
         })

         return new Promise(resolve => {
            const stream = createWriteStream(oggPath)
            response.data.pipe(stream)
            stream.on('finish', () => resolve(oggPath))
         })
        
      } catch (e) {
         console.log('Error while creating ogg' , e.message)
      }
    }
}

export const ogg = new OggConverter()