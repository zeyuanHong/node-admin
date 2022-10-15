import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState, useEffect } from 'react';
import PorpTypes from 'prop-types';
import api, { staticUrl } from '../../api/api';
import { deldetailimg } from '../../api/service';

const Uploadimg = ({ setImgList, imgList }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => { // 传入的imgList改变时，更新fileList
    if (imgList) {
      let arr = imgList.split(",").map((item) => ({
        url: staticUrl + item,
        name: item,
        status: "done",
        uid: item,
      }));
      setFileList(arr)
    } else {
      setFileList([])
    }
  }, [imgList])

  const onChange = ({ file, fileList: newFileList }) => { // 上传图片
    // 如果上传文件后端有返回值
    if (file.response && file.response.success) {
      const { url } = file.response.data
      newFileList.at(-1).url = staticUrl + url;
      newFileList.at(-1).name = url;
      newFileList.at(-1).status = "done";
      setImgList(newFileList.map((item) => item.name).join(",")) //把地址从数组放入字符串
    }
    setFileList(newFileList);
  };

  // 删除图片
  const handleRemove = (file) => {
    const { name } = file;
    deldetailimg({ file: [name] }, (res) => {
      if (fileList.length === 1) {
        setFileList([]);
      }
      message.success("删除成功!");
    });
  };

  const onPreview = async (file) => { //本地预览
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop rotate>
      <Upload
        action={api.adddetailimg}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onRemove={handleRemove}
        onPreview={onPreview}
      >
        {fileList.length < 5 && '+ 上传'}
      </Upload>
    </ImgCrop>
  );
};

Uploadimg.defaultProps = { // 默认值
  setImgList: () => "",
  imgList: "",
};

Uploadimg.prototype = { // 类型检查
  setImgList: PorpTypes.func,
  imgList: PorpTypes.string,
}

export default Uploadimg;