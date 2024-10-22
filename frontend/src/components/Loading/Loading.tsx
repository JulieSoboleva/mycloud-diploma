import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

export default function Loading() {
    return (
        <Flex align='center' gap='middle'>
            <Spin 
                className='loading'
                indicator={
                    <LoadingOutlined style={{ fontSize: 48 }} spin />
                } 
            />
        </Flex>
    );
}