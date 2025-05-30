import React, { useState,useEffect } from 'react';
import { useStore } from '../store/store';
import Navbar from '../components/Navbar';
import { Client, Databases, ID,Query } from 'appwrite';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PaymentPortal() {
  const user = useStore((state) => state.User);
  const mentor = useStore((state)=>state.mentorId)
  const [MentorId,setMentorId] = useState('')
  const setpaymentstate = useStore((state)=>state.setpaymentstate)
  const [form, setForm] = useState({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    transactionId: '',
    transactionDateTime: '',
    prefferedDateTime: ''
  });

  const navigate = useNavigate()
  useEffect(() => {
    const getmentorid = async()=>{
      const client = new Client();
          client.setEndpoint("https://fra.cloud.appwrite.io/v1").setProject("6826c7d8002c4477cb81");
      
          const database = new Databases(client);
          const res = await database.listDocuments(
            "6826d3a10039ef4b9444",
            "6826dd9700303a5efb90",
            [Query.equal('username', mentor)]
          );

          setMentorId(res.documents[0].id)
    }
    getmentorid()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const client = new Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6820683500148a9573af');

      const database = new Databases(client);

      await database.createDocument(
        '6820add100102346d8b7', // databaseId
        '68280ac50027ed33d5d2', // collectionId
        ID.unique(),
        {
          username:user.name,
          Clientid: form.id,
          PaymentId: form.transactionId,
          Mentorid:MentorId,
          PaymentDateandTime: form.transactionDateTime,
          prefferedDateTime: form.prefferedDateTime,
          Verified:false
        }
      )
        setpaymentstate(true)
        toast.success('Verification request generated!');
        navigate('/sessionbook')
      

    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-[#f9f9ff] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 w-full max-w-4xl">
          <h2 className="text-3xl font-semibold text-center text-[#3f3d56] mb-8">
            MoodMigo Payment Confirmation
          </h2>

          <div className="flex flex-col md:flex-row gap-10">
            {/* QR Code Section */}
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg p-6 border">
              <img
                src="/scanner.jpg"
                alt="QR Code"
                
              />
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                <input
                  type="text"
                  name="transactionId"
                  value={form.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Date & Time</label>
                <input
                  type="datetime-local"
                  name="transactionDateTime"
                  value={form.transactionDateTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date & Time</label>
  <input
    type="datetime-local"
    name="prefferedDateTime" // ✅ Correct
    value={form.prefferedDateTime}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    required
  />
</div>



              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition duration-200"
              >
                Confirm Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPortal;
