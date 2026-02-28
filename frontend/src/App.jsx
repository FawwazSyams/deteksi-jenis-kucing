import { useState } from 'react'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resultImage, setResultImage] = useState(null)
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(false)

  // Ganti URL ini dengan URL Railway kamu nanti!
  const API_URL = "http://localhost:8000/detect"

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResultImage(null)
      setDetections([])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return alert("Pilih gambar kucing dulu, ya!")
    
    setLoading(true)
    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.gambar_hasil) {
        setResultImage(`data:image/jpeg;base64,${data.gambar_hasil}`)
        setDetections(data.hasil_teks)
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Gagal menghubungi server AI.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-blue-600 px-8 py-10 text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            🐱 AI Deteksi Jenis Kucing
          </h1>
          <p className="text-blue-100 text-lg">
            Upload foto kucing, biar AI yang tebak jenisnya!
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mx-auto"
            />
            
            {previewUrl && !resultImage && (
              <div className="mt-6 flex justify-center">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-72 rounded-lg shadow-md object-contain"
                />
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-8 text-center">
            <button 
              onClick={handleUpload} 
              disabled={loading || !selectedFile}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
            >
              {loading ? "Sedang Menganalisis..." : "Deteksi Kucing Sekarang! 🚀"}
            </button>
          </div>

          {/* Results Section */}
          {resultImage && (
            <div className="mt-12 pt-8 border-t-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Hasil Deteksi 🎯
              </h2>
              
              <div className="flex justify-center mb-6">
                <img 
                  src={resultImage} 
                  alt="Hasil AI" 
                  className="max-h-96 rounded-xl shadow-2xl object-contain border-4 border-blue-50" 
                />
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-blue-900 mb-3 text-lg">Kucing yang terdeteksi:</h3>
                <ul className="space-y-3">
                  {detections.length > 0 ? detections.map((cat, index) => (
                    <li key={index} className="flex items-center text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                      <span className="text-xl mr-3">✅</span>
                      <span className="font-medium text-lg mr-2">{cat.jenis}</span> 
                      <span className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md">
                        Akurasi: {cat.akurasi}
                      </span>
                    </li>
                  )) : (
                    <li className="text-red-500 font-medium flex items-center">
                      <span className="mr-2">❌</span> Waduh, kucingnya tidak terdeteksi nih! Coba foto lain.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App