import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import PropTypes from 'prop-types';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import api, { staticUrl } from '../../api/api'

function MyEditor({ setEditorHtml,htmlCon }) {
    // editor 实例
    const [editor, setEditor] = useState(null)                   // JS 语法

    // 编辑器内容
    const [html, setHtml] = useState('')

    useEffect(()=>{ // 传入的htmlCon改变时，更新html
        setHtml(htmlCon)
    },[htmlCon])

    // 工具栏配置
    const toolbarConfig = {}                        // JS 语法

    // 编辑器配置
    const editorConfig = {                         // JS 语法
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                server: api.adddetailimg, // 图片上传地址，后端要返回固定的格式editor才能识别。
                Headers: {
                    // 配置请求头
                    Authorization: sessionStorage.getItem("token"),
                },
                fieldName: "file",
                // 单个文件的最大体积限制，默认为 2M
                maxFileSize: 1 * 1024 * 1024, // 1M

                // 最多可上传几个文件，默认为 100
                maxNumberOfFiles: 10,

                // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
                allowedFileTypes: ["image/*"],

                // 超时时间，默认为 10 秒
                timeout: 60 * 1000, // 60 秒
                customInsert(res, insertFn) {
                    // 自定义插入图片
                    // res 即服务端的返回结果
                    // 从 res 中找到 url alt href ，然后插入图片
                    const { url } = res.data
                    // 把上传的图片拼接上服务器地址
                    insertFn(staticUrl + url, "", "")
                },
            },
        },
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    const handleChange = (editor) => {
        setHtml(editor.getHtml())
        setEditorHtml(editor.getHtml())
    }

    return (
        <>
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={handleChange}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>
        </>
    )
}


MyEditor.defaultProps = {
    setEditorHtml: () => "",
    htmlCon: "",
}

MyEditor.prototype = {
    setEditorHtml: PropTypes.func,
    htmlCon: PropTypes.string,
}

export default MyEditor