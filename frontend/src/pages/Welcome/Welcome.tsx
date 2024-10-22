import { Card } from 'antd'
import './welcome.scss'

export default function Welcome() {
  return (
    <Card className='card'
      title={<h1>Облачное хранилище MyCloud</h1>}
      bordered={false}
    >
      <div className='details'>
        <img src={'https://img.freepik.com/premium-photo/cloud-computing-system-concept_869423-151.jpg?size=626&ext=jpg'} alt='cloud' width={300} />
        <div className='details__info'>
          <h2>Позволяет пользователям загружать, переименовывать файлы, делиться ими с помощью специальной ссылки и скачивать</h2>
          <h3>Для начала работы нужно войти или зарегистрироваться</h3>
        </div>
      </div>
    </Card>
  );
}