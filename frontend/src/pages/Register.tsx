import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormProps } from 'antd'
import { Button, Card, Form, Input, message } from 'antd'
import { useAppDispatch, useAppSelector } from '../hooks'
import { registerUser } from '../services/userServices'
import { clearError, usersState } from '../redux/slices/usersSlice'

interface FieldType {
  userName?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  repeat?: string,
}

export default function Register() {
  const { isLoading } = useAppSelector(usersState);
  const [, setError] = useState('');
  const disispatch = useAppDispatch();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    setError('');
    const formData = {
      username: values.userName ?? '',
      first_name: values.firstName ?? '',
      last_name: values.lastName ?? '',
      email: values.email ?? '',
      password: values.password ?? '',
      repeat: values.repeat ?? '',
    };
    
    disispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        console.log('Регистрация пользователя выполнена успешно');
        message.success({
          content: 'Регистрация пользователя выполнена успешно',
          duration: 2,
        });
        disispatch(clearError());
        navigate('/login');
      })
      .catch((error) => {
        console.log('Ошибка регистрации пользователя:', error);
        setError(error.message);
        message.error({
          content: error,
          duration: 2,
          style: {
            marginTop: '35vh',
          },
        });
      });
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Ошибка регистрации пользователя:', errorInfo);
    message.error({
      content: errorInfo.errorFields[0].errors[0],
      duration: 2,
      style: {
        marginTop: '35vh',
      },
    });
  };
  
  return (
     <Card 
      className='card'
      title={<h1>Регистрация</h1>}
      bordered={false}
    > 
      <Form
        name='basic'
        layout='vertical'
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
        className='form'
      >
        <Form.Item<FieldType>
          label='Логин'
          name='userName'
          wrapperCol={{ sm: 24 }}
          validateTrigger='onBlur'
          rules={[
            { required: true, message: 'Пожалуйста, введите логин' },
            {
              pattern: /^[a-zA-Z]{1}[a-zA-Z0-9]{3,19}$/,
              message: 'Логин должен содержать только латинские буквы и цифры, начинаться на букву и быть от 4 до 20 символов',
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label='Email'
          name='email'
          wrapperCol={{ sm: 24 }}
          validateTrigger='onBlur'
          rules={[
            {  
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Введите корректный адрес электронной почты',
            }
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item<FieldType>
          label='Имя'
          name='firstName'
          wrapperCol={{ sm: 24 }}
          rules={[{ required: false }]}
        >
          <Input placeholder="Иван" />
        </Form.Item>

        <Form.Item<FieldType>
          label='Фамилия'
          name='lastName'
          wrapperCol={{ sm: 24 }}
          rules={[{ required: false }]}
        >
          <Input placeholder="Иванов" />
        </Form.Item>

        <Form.Item<FieldType>
          label='Пароль'
          name='password'
          wrapperCol={{ sm: 24 }}
          validateTrigger='onBlur'
          rules={[
            { required: true, message: 'Пожалуйста, введите пароль' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{6,}$/,
              message: 'Пароль должен содержать минимум 6 символов, включая одну заглавную букву, одну строчную букву, одну цифру и один специальный символ',
            }
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label='Подтверждение пароля'
          name='repeat'
          dependencies={['password']}
          wrapperCol={{ sm: 24 }}
          rules={[
            { 
              required: true,
              message: 'Пожалуйста, повторите введённый пароль' 
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ sm: 24 }}>
          <Button 
            type='primary'
            htmlType='submit'
            size='large'
            loading={isLoading}
          >
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}