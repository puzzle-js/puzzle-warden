import {Readable, Writable} from "stream";
import {WardenStream} from "./warden-stream";

class StreamHead {
  readStream: Readable = new Readable({
    read: () => {},
    objectMode: true
  });
  returnStream: Writable = new Writable({
    objectMode: true,
    write(chunk: any, encoding: string, callback: (error?: Error | null) => void){
      callback();
    }
  });

  connect(wardenStream: WardenStream) {
    this.readStream
      .pipe(wardenStream.rightStream);

    wardenStream.leftStream
      .pipe(this.returnStream);

    return wardenStream;
  }
}

export {
  StreamHead
};
