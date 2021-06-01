import * as humanseg from '@paddlejs-models/humanseg';
//引入一个人像分割paddlejs模型工程套件 包含前后处理和paddlejs前端推理引擎

async function load() {
    // load humanseg model 从网络上下载模型文件
    await humanseg.load();
}

load();

async function run(input) { // input 传入的图片
    // get the gray value [192 * 192]; 
    const { data } = await humanseg.getGrayValue(input);//包含前处理，将图片转换成浮点数据，推理，调用paddlejs封装的接口，完成模型的在线推理流程，拿到模型分割后的结果

    // draw human segmentation
    const canvas1 = document.getElementById('demo1');//获取浏览器页面画布元素canvas1
    humanseg.drawHumanSeg(canvas1, data);//后处理，调用api，通过分割后的结果获取图片人像，并在canvas1里绘制分割后的人像

    // draw the background mask
    const canvas2 = document.getElementById('demo2');//获取第二个canvas 画mask反向遮罩
    humanseg.drawMask(canvas2, data, true);//后处理，调用api，通过分割后的结果获取图片人像遮罩，在canvas2里绘制遮罩
}
//允许用户上传图片，上传完成时，调用paddlejs能力，实现分割
function selectImage(file) {
    if (!file.files || !file.files[0]) {
        return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
        const img = document.getElementById('image');
        img.src = evt.target.result;
        img.onload = function () {
            run(img);//调用之前run方法
        };
    };
    reader.readAsDataURL(file.files[0]);
}
 
// selectImage 绑定上传图片的能力到网页上传图片按钮
document.getElementById('uploadImg').onchange = function () {
    selectImage(this);
};
