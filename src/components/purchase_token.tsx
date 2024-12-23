import React, { useState, useEffect } from 'react';
import MakePaymentButton from '../components/make_payment';
import { QRCodeSVG } from 'qrcode.react';
import styles from '../styles/purchasemodal.module.css';

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? '';

type PaymentMethod = 'ETH' | 'USDT' | 'BTC';

interface PurchaseTokenProps {
  isOpen: boolean;
  setIsPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PurchaseToken: React.FC<PurchaseTokenProps> = ({ isOpen, setIsPurchaseModalOpen }) => {
  const ETH_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS ?? '';
  const BTC_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_BTC_RECIEVER_ADDRESS ?? '';
  const USDT_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_USDT_RECIEVER_ADDRESS ?? '';

  const [tanacoinAmount, setTanacoinAmount] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ETH');
  const [tanacoinRate, setTanacoinRate] = useState<number>(0);
  const [conversionRates, setConversionRates] = useState<{ [key in PaymentMethod]: number }>({
    ETH: 0,
    USDT: 0,
    BTC: 0,
  });
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [totalSold, setTotalSold] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getReceiverAddress = (method: PaymentMethod): string => {
    switch (method) {
      case 'ETH': return ETH_RECEIVER_ADDRESS;
      case 'USDT': return USDT_RECEIVER_ADDRESS;
      case 'BTC': return BTC_RECEIVER_ADDRESS;
      default: return '';
    }
  };

  const receiverAddress = getReceiverAddress(paymentMethod);

  const fetchTanacoinData = async () => {
    try {
      setIsLoading(true);
      const [priceRes, totalSoldRes, totalSupplyRes] = await Promise.all([
        fetch(`${apiUrl}/tanacoin-info?type=price`),
        fetch(`${apiUrl}/tanacoin-info?type=sold`),
        fetch(`${apiUrl}/tanacoin-info?type=totalSupply`),
      ]);

      if (!priceRes.ok || !totalSoldRes.ok || !totalSupplyRes.ok) {
        throw new Error('Failed to fetch Tanacoin data');
      }

      const [priceData, totalSoldData, totalSupplyData] = await Promise.all([
        priceRes.json(),
        totalSoldRes.json(),
        totalSupplyRes.json(),
      ]);

      setTanacoinRate(priceData.price || 0);
      setTotalSold(totalSoldData.tanacoinsSold || 0);
      setTotalSupply(totalSupplyData.totalSupply || 0);

      const ratesRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,tether,bitcoin&vs_currencies=usd,eur');
      if (!ratesRes.ok) {
        throw new Error('Failed to fetch conversion rates');
      }

      const ratesData = await ratesRes.json();
      setConversionRates({
        ETH: ratesData.ethereum.eur || 0,
        USDT: ratesData.tether.usd || 0,
        BTC: ratesData.bitcoin.eur || 0,
      });
    } catch (err) {
      setError('Error fetching data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchTanacoinData();
    const intervalId = setInterval(fetchTanacoinData, 30000);

    return () => clearInterval(intervalId); // Cleanup interval
  }, [isOpen]);

  useEffect(() => {
    if (!tanacoinRate || !tanacoinAmount || !conversionRates[paymentMethod]) return;

    const euroAmount = tanacoinAmount * tanacoinRate;
    let convertedAmount = 0;

    switch (paymentMethod) {
      case 'ETH': convertedAmount = euroAmount / conversionRates.ETH; break;
      case 'USDT': convertedAmount = euroAmount * conversionRates.USDT; break;
      case 'BTC': convertedAmount = euroAmount / conversionRates.BTC; break;
    }

    setPaymentAmount(convertedAmount || 0);
  }, [tanacoinAmount, paymentMethod, tanacoinRate, conversionRates]);

  const handleCopyToClipboard = () => {
    if (receiverAddress) {
      navigator.clipboard.writeText(receiverAddress);
      alert('Address copied to clipboard!');
    } else {
      setError('No receiver address available');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setIsPurchaseModalOpen(false)}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.purchaseContainer}>
          <h2>Purchase Tanacoin</h2>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div>
                <p>1 Tanacoin = {tanacoinRate} EUR</p>
                <p>Total Supply: {totalSupply}</p>
                <p>Total Sold: {totalSold}</p>
              </div>
              <div>
                <label>
                  Tanacoin Amount:
                  <input type="number" value={tanacoinAmount} onChange={(e) => setTanacoinAmount(+e.target.value)} />
                </label>
                <label>
                  Payment Method:
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                    <option value="BTC">BTC</option>
                  </select>
                </label>
              </div>
              <div>
                <p>Amount to Pay ({paymentMethod}): {paymentAmount.toFixed(10)}</p>
              </div>
              <MakePaymentButton
                  paymentAmount={paymentAmount}
                  paymentMethod={paymentMethod}
                  setError={setError}
                  setLoading={setIsLoading} 
                  tanacoinRate={tanacoinRate}              />
              <div>
                {receiverAddress && <QRCodeSVG value={receiverAddress} size={128} />}
                <button onClick={handleCopyToClipboard}>Copy Address</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseToken;
