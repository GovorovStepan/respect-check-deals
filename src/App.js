import './App.css';
import React, { useState } from 'react';
import findDuplicates from './findDuplicates';
import fetchData from './batch';
import { Button, Spin, Space, Card } from 'antd';
import formatDateTime from './formatDate';

function App() {

  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(true)
  const [deals, setDeals] = useState([]);
  const [duplicates, setDuplicates] = useState({});

  const check = async () => {
    setLoading(true)
    const dealsRes = await fetchData({
      "method": "crm.deal.list",
      "select": ["ID", "TITLE", "CONTACT_ID", "DATE_CREATE"],
    });
    setDeals(dealsRes);
    console.log('deals', dealsRes);
    const duplicatesRes = findDuplicates(dealsRes)
    console.log('duplicates', duplicatesRes)
    setDuplicates(duplicatesRes);
    setLoaded(true);
    setLoading(false);
  }


  function renderDuplicates() {
    return Object.keys(duplicates).map((key) => {
      return renderDuplicateElement(key, duplicates[key]);
    });
  }

  const renderDuplicateElement = (key, el) => {
    if (key != null && key !== 'null') {
      return (
        <Card key={key} title={<a target='_blank' href={`https://myrespect.bitrix24.ru/crm/contact/details/${key}/`}>Контакт</a>} style={{ width: 300 }}>
          {el.map((elem) => {
            const data = deals.find(item => item.ID === elem);
            return (
              <p key={data['ID']}> <a target='_blank'  href={`https://myrespect.bitrix24.ru/crm/deal/details/${data['ID']}/`}>{data['TITLE']}</a> от <span>{formatDateTime(data['DATE_CREATE'])}</span></p>
            )
          })}
        </Card>
      );
    } else {
      return (
        <Card key='without' title='Без контакта' style={{ width: 300 }}>
          {el.map((elem) => {
            const data = deals.find(item => item.ID === elem);
            return (
              <p key={data['ID']}> <a target='_blank'  href={`https://myrespect.bitrix24.ru/crm/deal/details/${data['ID']}/`}>{data['TITLE']}</a> от <span>{formatDateTime(data['DATE_CREATE'])}</span></p>
            )
          })}
        </Card>
      );
    }
  };

  return (
    <div className="App">
      <div className='App-header'>
        <Spin spinning={loading} >
          <Button type="primary" size='large' onClick={check}>Проверить дубликаты сделок</Button>
        </Spin>
        {loaded &&
          <div>
            <Space direction="vertical" size={16}>
              {renderDuplicates()}
            </Space>
          </div>
        }

      </div>
    </div>
  );
}

export default App;
