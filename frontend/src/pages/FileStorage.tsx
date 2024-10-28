import moment from 'moment'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Flex, message, Table, TableProps, Tooltip } from 'antd'
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { usersState } from '../redux/slices/usersSlice'
import {
  clearError,
  clearFilesList,
  filesState
} from '../redux/slices/filesSlice'
import { formatFileSize, useAppDispatch, useAppSelector } from '../hooks'
import { IChangeFileData, IDownloadFileData, IFile } from '../models'
import DownloadSection from '../components/DownloadSection/DownloadSection'
import { changeFile, deleteFile, downloadFile, getFileLink, getFilesList } from '../services/fileServices'

function copyToClipboard(special_link: string) {
  const textArea = document.createElement('textarea');
  textArea.value = special_link;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
  console.log('Ссылка скопирована в буфер обмена');
}

export default function StoragePage() {
  const { currentUser, storageOwner } = useAppSelector(usersState);
  const { filesList, error } = useAppSelector(filesState);
  
  const [, setShowAlert] = useState(false);
  const dispatch = useAppDispatch(); 

  useEffect(() => {
    dispatch(getFilesList(storageOwner?.username));

    return () => {
      dispatch(clearFilesList());
      dispatch(clearError());
    };
  }, [dispatch, storageOwner?.username]);

  useEffect(() => {
    if (error) {
        setShowAlert(true);
    } else {
        setShowAlert(false);
    }
  }, [error]);

  const handleEditFileName = (id: number, file_name: string) => {
    const newFileName = prompt(
      'Введите новое имя файла:',
      file_name
    );

    if (newFileName) {
      const newFileData: IChangeFileData = { id, file_name: newFileName };

      dispatch(changeFile(newFileData))
        .unwrap()
        .then(() => {
          console.log('Файл переименован');
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => {
          console.log(error)
          message.error({
            content: 'Ошибка переименования: ' + error,
            duration: 2,
          });
        });
    }
  };

  const handleEditFileComment = (id: number, comment: string) => {
    const newFileComment = prompt(
      'Введите новый комментарий к файлу:',
      comment
    );

    if (newFileComment) {
      const newFileData: IChangeFileData = { id, comment: newFileComment };

      dispatch(changeFile(newFileData))
        .unwrap()
        .then(() => {
          console.log('Комментарий к файлу изменён');
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => {
          console.log(error);
          message.error({
            content: 'Ошибка изменения комментария: ' + error,
            duration: 2,
          });
        })
    }
  };

  const handleDownloadFile = (id: number, file_name: string) => {
    const fileData : IDownloadFileData = { id, file_name };

    dispatch(downloadFile(fileData))
      .unwrap()
      .then(() => {
        console.log('Файл успешно скачан');
        message.success({
          content: 'Файл успешно скачан',
          duration: 2,
        });
        dispatch(getFilesList(storageOwner?.username));
      })
      .catch((error) => {
        console.log(error);
        message.error({
          content: 'Ошибка скачивания файла: ' + error,
          duration: 2,
        });
      })
  };

  const handleGetFileLink = (id: number) => {
    dispatch(getFileLink(id))
      .unwrap()
      .then((data) => {
        console.log('Специальная ссылка на файл получена');
        copyToClipboard(data.special_link);
        message.success({
          content: 'Специальная ссылка на файл получена и скопирована в буфер обмена',
          duration: 2,
        });
      })
      .catch((error) => {
        console.log(error);
        message.error({
          content: 'Ошибка получения специальной ссылки на файл: ' + error,
          duration: 2,
        });
      });
  };

  const handleDeleteFile = (id: number) => {
    if (confirm('Вы действительно хотите удалить файл?')) {
      dispatch(deleteFile(id))
        .unwrap()
        .then(() => {
          console.log('Файл успешно удалён');
          message.success({
            content: 'Файл успешно удалён',
            duration: 2,
          });
          dispatch(getFilesList(storageOwner?.username));
        })
        .catch((error) => {
          console.log(error);
          message.error({
            content: 'Ошибка удаления файла: ' + error,
            duration: 2,
          });
        });
    }
  };

  const columns: TableProps<IFile>['columns'] = [
    {
      title: 'Имя файла',
      dataIndex: 'file_name',
      key: 'file_name',
      render: (text, record) => (
        <Tooltip placement='topLeft' title='Нажмите для редактирования'>
          <a onClick={() => handleEditFileName(record.id, record.file_name)}>
            {text}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => a.file_name.localeCompare(b.file_name),
      showSorterTooltip: false,
    },
    {
      title: 'Комментарий',
      dataIndex: 'comment',
      key: 'comment',
      render: (text, record) => (
        <Tooltip placement='topLeft' title='Нажмите для редактирования'>
          <a onClick={() => handleEditFileComment(record.id, record.comment)}>
            {text}
          </a>
        </Tooltip>
      ),
      sorter: (a, b) => a.comment.localeCompare(b.comment),
      showSorterTooltip: false,
    },
    {
      title: 'Размер',
      dataIndex: 'size',
      key: 'size',
      render: (text) => formatFileSize(text),
      sorter: (a, b) => a.size - b.size,
      showSorterTooltip: false,
    },
    {
      title: 'Дата загрузки',
      dataIndex: 'uploaded',
      key: 'uploaded',
      render: (text) => moment(text).format('DD.MM.YYYY'),
      sorter: (a, b) => a.uploaded.localeCompare(b.uploaded),
      showSorterTooltip: false,
    },
    {
      title: 'Дата скачивания',
      dataIndex: 'downloaded',
      key: 'downloaded',
      render: (text) => text ? moment(text).format('DD.MM.YYYY') : '',
      sorter: (a, b) => {
        const aDownloaded = a.downloaded || '';
        const bDownloaded = b.downloaded || '';
        return aDownloaded.localeCompare(bDownloaded);
      },
      showSorterTooltip: false,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Flex justify="space-evenly" align="center">
          <Tooltip 
            placement='top'
            title='Скачать файл'
          >
            <Button
              icon={<CloudDownloadOutlined/>}
              onClick={() => handleDownloadFile(record.id, record.file_name)} />
          </Tooltip>
          <Tooltip 
            placement='top'
            title='Получить специальную ссылку'
          >
            <Button
              icon={<ShareAltOutlined/>}
              onClick={() => handleGetFileLink(record.id)} />
          </Tooltip>
          <Tooltip 
            placement='top'
            title='Удалить файл'
          >
            <Button
              icon={<DeleteOutlined/>}
              onClick={() => handleDeleteFile(record.id)} />
          </Tooltip>
        </Flex>
      ),
    }
  ];

  return (
    <Card 
      className='card'
      title={currentUser?.username === storageOwner?.username ? 
        <h1>Ваше файловое хранилище</h1> :
        <h1>Файлы пользователя "{storageOwner?.username}"</h1>
      }
      bordered={false}
    >
      {error ?
        <Alert type='error' message={error} closable onClose={() => setShowAlert(false)} /> :
        <>
          <Table dataSource={filesList} columns={columns} />
          <DownloadSection />
        </>
      }
    </Card>
  );
}