/* eslint-disable max-classes-per-file */
declare module 'amrToMp3' {
  function amrToMp3(filepath: string, outputDir: string = './src/mp3', outputName: string): Promise<string>

  export default amrToMp3;
}
