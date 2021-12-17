export function fileToString(file: Blob): Promise<string> {
  const fr = new FileReader()
  fr.readAsText(file, 'utf-8')
  return new Promise( (resolve, reject) => {
    try {
      fr.onloadend = () => resolve(fr.result.toString())
    } catch(e) { reject(e) }
  })
}