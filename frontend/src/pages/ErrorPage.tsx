import { Card } from 'antd'

export default function ErrorPage() {
    return (
        <Card className='card'
            title={<h1>Страница не найдена</h1>}
            bordered={false}
        >
            <div className='details'>
                <img src={'https://avatars.mds.yandex.net/i?id=d2813b953fda78713062ed16d3503747abd69283-6339443-images-thumbs&n=13'} alt='cloud' width={300} />
                <div className='details__info'>
                    <h3>К сожалению, запрашиваемая Вами страница не найдена</h3>
                </div>
            </div>
        </Card>
    );
}