// вспомогательная функция для сжатия изображения
export const resizeImage = image => {
    // создать элемент canvas
    const canvas = document.createElement("canvas");
    // подобрать размер для canvas из размера изображения
    canvas.width = image.width;
    canvas.height = image.height;
    // нарисовать изображение в canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // вернуть сжатое JPG изображение
    return canvas.toDataURL("image/jpeg", 0.1);
};
