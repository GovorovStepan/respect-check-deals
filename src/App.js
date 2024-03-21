import './App.css';
import React, { useState } from 'react';
import findDuplicates from './findDuplicates';
import fetchData from './batch';
import { Button, Spin, Space, Card } from 'antd';
import formatDateTime from './formatDate';
import findPhoneDuplicates from './findPhoneDuplicates';

function App() {

  const [loading, setLoading] = useState(false)
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [loaded, setLoaded] = useState(true)
  const [loadedContacts, setLoadedContacts] = useState(true)
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [duplicates, setDuplicates] = useState({});
  const [contactsDuplicates, setContactDuplicates] = useState({});

  const checkDeals = async () => {
    setLoading(true)
    const dealsRes = await fetchData({
      "method": "crm.deal.list",
      "select": ["ID", "TITLE", "CONTACT_ID", "DATE_CREATE"],
    });
    setDeals(dealsRes);
    const duplicatesRes = findDuplicates(dealsRes)
    setDuplicates(duplicatesRes);
    setLoaded(true);
    setLoading(false);
  }

  const checkContacts = async () => {
    setLoadingContacts(true)
    const contactsRes = await fetchData({
      "method": "crm.contact.list",
      "select": ["ID", "NAME", "PHONE", "DATE_CREATE"],
    });
    console.log('contactsRes', contactsRes)
    setContacts(contactsRes);
    const contactDuplicatesRes = findPhoneDuplicates(contactsRes)
    console.log('contactDuplicatesRes', contactDuplicatesRes)
    setContactDuplicates(contactDuplicatesRes);
    setLoadedContacts(true);
    setLoadingContacts(false);
  }

  const check = async () => {
    await checkDeals()
    await checkContacts()
  }


  function renderDuplicates() {
    return Object.keys(duplicates).map((key) => {
      return renderDuplicateElement(key, duplicates[key]);
    });
  }
  function renderContactDuplicates() {
    return Object.keys(contactsDuplicates).map((key) => {
      return renderContactDuplicateElement(key, contactsDuplicates[key]);
    });
  }

  const renderDuplicateElement = (key, el) => {
    if (key != null && key !== 'null') {
      return (
        <Card key={key} title={<a target='_blank' href={`https://myrespect.bitrix24.ru/crm/contact/details/${key}/`} rel="noreferrer">Контакт</a>} style={{ minWidth: 300 }}>
          {el.map((elem) => {
            const data = deals.find(item => item.ID === elem);
            return (
              <p key={data['ID']}> <a target='_blank' href={`https://myrespect.bitrix24.ru/crm/deal/details/${data['ID']}/`} rel="noreferrer">{data['TITLE']}</a> от <span>{formatDateTime(data['DATE_CREATE'])}</span></p>
            )
          })}
        </Card>
      );
    } else {
      return (
        <Card key='without' title='Без контакта' style={{ minWidth: 300 }}>
          {el.map((elem) => {
            const data = deals.find(item => item.ID === elem);
            return (
              <p key={data['ID']}> <a target='_blank' href={`https://myrespect.bitrix24.ru/crm/contact/details/${data['ID']}/`} rel="noreferrer">{data['TITLE']}</a> от <span>{formatDateTime(data['DATE_CREATE'])}</span></p>
            )
          })}
        </Card>
      );
    }
  };


  const renderContactDuplicateElement = (key, el) => {
    return (
      <Card key={key} title={key} style={{ minWidth: 300 }}>
        {el.map((elem) => {
          const data = contacts.find(item => item.ID === elem.ID);
          const dealsList = deals.filter(item => item.CONTACT_ID === elem.ID);
          return (
            <Card key={data['ID']}
              title={
                <a target='_blank' href={`https://myrespect.bitrix24.ru/crm/contact/details/${data['ID']}/`} rel="noreferrer">
                  {data['NAME']}
                </a>}
              style={{ minWidth: 270, marginBottom: 16 }}
            >
              <span style={{color:'grey'}}> Дата создания контакта -  {formatDateTime(data['DATE_CREATE'])}</span>
              <div>
                <span style={{color:'grey'}}>Список сделок:</span>
                {
                  dealsList.map((deal) => {
                    return (
                      <p key={data['ID']}> <a target='_blank' href={`https://myrespect.bitrix24.ru/crm/deal/details/${deal['ID']}/`} rel="noreferrer">{deal['TITLE']}</a> от <span>{formatDateTime(deal['DATE_CREATE'])}</span></p>
                    )
                  })
                }

              </div>
            </Card>
          )
        })}
      </Card>
    );

  }

  return (
    <div className="App">
      <div style={{ marginTop: 36 }}>
        <Spin spinning={loading || loadingContacts} >
          <Button type="primary" size='large' onClick={check}>Проверить дубликаты</Button>
        </Spin>
      </div>
      <div className='App-header'>
        <div className='column'>
          <h4>Дубликаты сделок</h4>
          <Spin spinning={loading} >
            {loaded &&
              <div>
                <div>
                  <div className='sum_text'>Всего - {Object.keys(duplicates).length}</div>
                  <Space direction="vertical" size={16}>
                    {renderDuplicates()}
                  </Space>
                </div>
              </div>
            }
          </Spin>
        </div>
        <div className='column'>
          <h4>Дубликаты контактов</h4>
          <Spin spinning={loadingContacts} >
            {loadedContacts &&
              <div>
                <div>
                  <div className='sum_text'>Всего - {Object.keys(contactsDuplicates).length}</div>
                  <Space direction="vertical" size={16}>
                    {renderContactDuplicates()}
                  </Space>
                </div>
              </div>
            }
          </Spin>
        </div>

      </div>
    </div>
  );
}

export default App;
