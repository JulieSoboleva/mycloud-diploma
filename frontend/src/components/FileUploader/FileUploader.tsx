import { ChangeEvent, FormEvent, useState } from 'react'
import { Button, Flex, Input } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import { usersState } from '../../redux/slices/usersSlice'
import { filesState } from '../../redux/slices/filesSlice'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { getFilesList, uploadFile } from '../../services/fileServices'

const { TextArea } = Input;

interface FileUploaderProps {
  setShowForm: (show: boolean) => void;
}

export default function FileUploader({ setShowForm }: FileUploaderProps) {
  const { storageOwner } = useAppSelector(usersState);
  const { isLoading } = useAppSelector(filesState);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const dispatch = useAppDispatch();

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("user", String(storageOwner?.id));
      formData.append("file", file);
      formData.append("comment", comment);

      dispatch(uploadFile(formData))
        .unwrap()
        .then(() => {
          console.log("Файл успешно загружен");
          setComment("");
          setShowForm(false);
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id='file'
        type='file'
        accept='.txt,.doc,.docx,.pdf,.xls,.xlsx,.csv,.bmp,.jpg,.jpeg,.png,.gif,.tiff,.xml'
        title='Допустимые форматы: txt, doc, docx, pdf, xls, xlsx, csv, bmp, jpg, jpeg, png, gif, tiff, xml'
        onChange={handleInputFileChange}
        style={{ marginTop: '20px' }}
      />
      <div>
        <TextArea
          rows={1}
          placeholder='Комментарий к файлу'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ marginTop: '20px' }}
        ></TextArea>
      </div>
      <Flex gap="middle" wrap justify='center'>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          style={{ marginTop: '20px' }}
          loading={isLoading}
          icon={<CloudUploadOutlined />}
        >
          Загрузить файл в облако
        </Button>
        <Button 
          variant='outlined'
          color='primary'
          size='large'
          style={{ marginTop: '20px' }}
          onClick={() => setShowForm(false)}
        >
          Отмена
        </Button>
      </Flex>
    </form>
  );
};
