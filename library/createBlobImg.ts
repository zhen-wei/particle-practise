
export function createBlobImg(canvas: HTMLCanvasElement):Promise<HTMLImageElement> {
    return new Promise(resolve => {
        const img = new Image();

        img.addEventListener('load', () => {
            URL.revokeObjectURL(img.src);
            resolve(img);
        }, {once: true});

        canvas.toBlob(blob => {
            img.src = URL.createObjectURL(blob);
        });
    })
}