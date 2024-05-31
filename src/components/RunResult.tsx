import React, { FC, useEffect } from "react";
import { Form, Modal, Input } from "antd";
import { FormComponentProps } from "antd/es/form";
interface IPropType extends FormComponentProps{
  formatFunctions: string;
  result: string;
  open: boolean;
  onClose: any;
}

const RunResult: FC<IPropType> = ({
  formatFunctions,
  result,
  open,
  onClose,
  form,
}) => {
  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue({
        formatFunctions,
        result,
      });
    }
  }, [open]);
  const { getFieldDecorator } = form;
  return (
    // @ts-ignore
    <Modal
      title="调试"
      visible={open}
      footer={null}
      onCancel={() => onClose()}
      width={800}
    >
      <Form
        wrapperCol={{ span: 19 }}
        labelCol={{ span: 5 }}
      >
        <Form.Item label="格式化后的函数">
          {getFieldDecorator("formatFunctions", {
            initialValue: formatFunctions,
          })(
            <Input.TextArea readOnly rows={5} />
          )}
        </Form.Item>
        <Form.Item label="运行结果">
          {getFieldDecorator("result", {
            initialValue: result,
          })(<Input.TextArea readOnly rows={5} />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<IPropType>()(RunResult);
