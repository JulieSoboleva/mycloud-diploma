import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, TableProps, Alert, Switch, Flex, FloatButton, Tooltip } from 'antd'
import { DeleteOutlined, FolderOpenOutlined, LeftOutlined } from '@ant-design/icons'
import { formatFileSize, useAppDispatch, useAppSelector } from '../hooks'
import {
    clearUsersList,
    clearError,
    setStorageOwner,
    usersState,
} from '../redux/slices/usersSlice'
import { IFilesSize, IUser, IUserForAdmin } from '../models'
import { deleteUser, getUsersList, updateUser } from '../services/userServices'

const folderStyle: React.CSSProperties = {
    position: 'absolute',
    insetInlineEnd: '75px',
    bottom: '7px',
};

const deleteStyle: React.CSSProperties = {
  position: 'absolute',
  insetInlineEnd: '30px',
  bottom: '7px',
};

export default function Admin() {
    const { usersList, error } = useAppSelector(usersState);
    const [, setShowAlert] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getUsersList());
    
        return () => {
          dispatch(clearUsersList());
          dispatch(clearError());
        };
      }, [dispatch]);

    useEffect(() => {
        if (error) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [error]);
    
    const getTotalFilesSize = (files: IFilesSize[]): IFilesSize => {
        if (files.length === 0) {
            return {str_size: "", size: 0};
        }

        const totalFilesSize = files.reduce((total, file) => total + file.size, 0);
        const formattedSize = formatFileSize(totalFilesSize);
        return {str_size: formattedSize ?? "", size: totalFilesSize};
    };

    const handleChooseUser = (user: IUser) => {
        dispatch(setStorageOwner(user));
        navigate("/storage");
    };
    
    const handleChangeStatus = (id: number, is_staff: boolean) => {
        const newUserData = { id, is_staff: !is_staff };
    
        dispatch(updateUser(newUserData))
            .unwrap()
            .then(() => {
                console.log("Статус пользователя успешно изменён");
                dispatch(getUsersList());
            })
            .catch((error) => console.log(error));
    };
    
    const handleDeleteUser = (id: number) => {
        if (confirm("Вы действительно хотите удалить пользователя?")) {
            dispatch(deleteUser(id))
                .unwrap()
                .then(() => {
                console.log("Пользователь успешно удалён");
                dispatch(getUsersList());
                })
                .catch((error) => console.log(error));
        }
    };

    const columns: TableProps<IUserForAdmin>['columns'] = [
        {
          title: 'Логин',
          dataIndex: 'username',
          key: 'username',
          sorter: (a, b) => a.username.localeCompare(b.username),
          showSorterTooltip: false,
        },
        {
          title: 'Имя',
          dataIndex: 'first_name',
          key: 'first_name',
        },
        {
          title: 'Фамилия',
          dataIndex: 'last_name',
          key: 'last_name',
        },
        {
          title: 'Email адрес',
          dataIndex: 'email',
          key: 'email',
        },
        {
          title: 'Количество файлов',
          dataIndex: 'files',
          key: 'files',
          render: (files: IFilesSize[]) => files.length,
          sorter: (a, b) => a.files.length - b.files.length,
          showSorterTooltip: false,
        },
        {
          title: 'Размер файлов',
          dataIndex: 'files',
          key: 'size',
          render: (files: IFilesSize[]) => getTotalFilesSize(files).str_size,
          sorter: (a, b) => getTotalFilesSize(a.files).size - getTotalFilesSize(b.files).size,
          showSorterTooltip: false,
        },      
        {
          title: 'Роль администратора',
          dataIndex: 'is_staff',
          key: 'is_staff',
          render: (is_staff: boolean, user: IUserForAdmin) => (
            <Switch 
              checkedChildren={is_staff}
              checked={is_staff} 
              onChange={() => handleChangeStatus(user.id, is_staff)} 
            />
          ),
        },
        {
          title: 'Действия',
          key: 'actions',
          render: (user: IUser) => (
            <Flex justify="space-evenly" align="center">
              <FloatButton.Group
                key='open_group'
                shape='square'
                placement='left'
                style={folderStyle}
                icon={<LeftOutlined key='array' />}
              >
                <Tooltip 
                  placement='left'
                  title='Открыть'
                >
                  <FloatButton 
                    key='open_button'
                    icon={<FolderOpenOutlined/>} 
                    onClick={() => handleChooseUser(user)} />
                </Tooltip>
              </FloatButton.Group>
              
              <FloatButton.Group
                key='delete_group'
                shape='square'
                placement='left'
                style={deleteStyle}
                icon={<LeftOutlined key='array2' />}
              >
                <Tooltip 
                  placement='right'
                  title='Удалить'
                >
                  <FloatButton
                    key='delete_button'
                    icon={<DeleteOutlined/>}
                    onClick={() => handleDeleteUser(user.id)} />
                </Tooltip>
              </FloatButton.Group>
            </Flex>
          )
        }
    ];

    return (
        <Card 
            className='card'
            title={<h1>Список пользователей</h1>}
            bordered={false}
        > 
          {error ? 
          <Alert type='error' message={error} onClose={() => setShowAlert(false)} /> :  //closable
          <Table dataSource={usersList} columns={columns} /> }
        </Card>
    )
}