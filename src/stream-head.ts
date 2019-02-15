import {PassThrough, Readable, Writable} from "stream";
import {RequestChunk, ResponseChunk, WardenStream} from "./warden-stream";
import {performance} from "perf_hooks";

class StreamHead {
  name = 'Stream Head';
  readStream: Readable = new Readable({
    read: () => {},
    objectMode: true
  });

  private returnStream: Writable = new Writable({
    objectMode: true,
    write(chunk: ResponseChunk, encoding: string, callback: (error?: Error | null) => void){
      console.log(performance.now() - chunk.startMs);
      callback();
    }
  });

  private rightStreamName!: string;
  private rightLogStream: PassThrough = new PassThrough({objectMode: true});

  constructor(){
    // this.rightLogStream.on('data', (chunk: RequestChunk) => {
    //   console.log(`${this.name} --> ${this.rightStreamName}`, chunk);
    // });
  }

  connect(wardenStream: WardenStream) {
    this.rightStreamName = wardenStream.name;

    this.readStream
      .pipe(this.rightLogStream)
      .pipe(wardenStream.rightStream);

    wardenStream.sideStreamNames.left = this.name;

    wardenStream.leftStream
      .pipe(wardenStream.leftLogStream)
      .pipe(this.returnStream);

    return wardenStream;
  }
}

export {
  StreamHead
};
