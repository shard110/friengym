import React from 'react';
import FAQList from '../components/FAQList';
import QnaHeader from '../components/QnaHeader';
import Gnb from '../components/customerGnb';


function QnaPage() {

  return (
    <div>
       <Gnb />
            <QnaHeader/>
            <FAQList />
            
       
    </div>
   
  );
};

export default QnaPage;