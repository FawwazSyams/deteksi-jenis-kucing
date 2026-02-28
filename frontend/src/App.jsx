import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, RefreshCw, Scan, Activity, Target, Cpu } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('upload'); 
  
  const webcamRef = useRef(null);

  const API_URL = "https://fawwazsyams-api-deteksi-kucing.hf.space/detect";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null);
      setDetections([]);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPreviewUrl(imageSrc);
      setResultImage(null);
      setDetections([]);
      
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
        });
    }
  }, [webcamRef]);

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResultImage(null);
    setDetections([]);
    setInputMode('upload');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.gambar_hasil) {
        setResultImage(`data:image/jpeg;base64,${data.gambar_hasil}`);
        setDetections(data.hasil_teks);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal menghubungi server AI. Pastikan server di Hugging Face sudah 'Running'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-cyan-500 selection:text-white relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500px); }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl">
              <Scan className="text-cyan-400 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 tracking-tight">
                Deteksi Jenis Ras Kucing
              </h1>
              <p className="text-slate-400 text-sm font-medium tracking-wide">YOLOv8 Deep Learning Vision System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400">System Online</span>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-full min-h-[500px] flex flex-col">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-400" /> Visual Input
                </h2>
                {!previewUrl && (
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button onClick={() => setInputMode('upload')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${inputMode === 'upload' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>File</button>
                    <button onClick={() => setInputMode('camera')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${inputMode === 'camera' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Kamera</button>
                  </div>
                )}
                {previewUrl && (
                  <button onClick={resetAll} className="px-4 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-medium transition-colors border border-rose-500/20 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Reset
                  </button>
                )}
              </div>

              {/* Main Display Area */}
              <div className="flex-1 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center group">
                
                {!previewUrl ? (
                  inputMode === 'upload' ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900/50 transition-colors">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="w-20 h-20 mb-4 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all">
                        <Upload className="w-8 h-8 text-cyan-500" />
                      </div>
                      <p className="text-slate-300 font-medium text-lg">Upload Gambar Kucing Kamu</p>
                      <p className="text-slate-600 text-sm mt-1">Format: JPG, PNG, WEBP</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col relative w-full h-full bg-black">
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover opacity-80" videoConstraints={{ facingMode: "environment" }} />
                      
                      {/* Viewfinder Overlay Camera */}
                      <div className="absolute inset-0 pointer-events-none border-[40px] border-slate-950/50"></div>
                      <div className="absolute top-[40px] left-[40px] w-12 h-12 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl pointer-events-none"></div>
                      <div className="absolute top-[40px] right-[40px] w-12 h-12 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none"></div>
                      <div className="absolute bottom-[40px] left-[40px] w-12 h-12 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl pointer-events-none"></div>
                      <div className="absolute bottom-[40px] right-[40px] w-12 h-12 border-b-2 border-r-2 border-cyan-400 rounded-br-xl pointer-events-none"></div>

                      <div className="absolute bottom-6 w-full flex justify-center z-20">
                        <button onClick={capture} className="w-16 h-16 bg-white rounded-full border-4 border-slate-400 hover:scale-105 hover:border-cyan-400 transition-all flex items-center justify-center"></button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center p-2">
                    <img src={resultImage || previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl z-10" />
                    
                    {loading && (
                      <div className="absolute inset-0 z-20 overflow-hidden rounded-xl">
                        <div className="absolute inset-0 bg-cyan-900/20 backdrop-blur-[2px]"></div>
                        <div className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-scan absolute top-0 left-0"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <Activity className="w-12 h-12 text-cyan-400 animate-pulse mb-3" />
                          <span className="text-cyan-400 font-mono font-bold tracking-widest text-sm bg-slate-900/80 px-4 py-1 rounded-full border border-cyan-500/30">ANALYZING NEURAL NET...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Tombol Eksekusi Besar */}
            {previewUrl && !resultImage && (
              <button 
                onClick={handleUpload} 
                disabled={loading}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-indigo-600 p-[2px] rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 ease-out skew-x-12 -ml-20 w-1/2"></div>
                <div className="bg-slate-900/80 backdrop-blur-sm px-8 py-6 rounded-[22px] flex items-center justify-center gap-4">
                  <Cpu className={`w-8 h-8 ${loading ? 'text-cyan-400 animate-spin' : 'text-cyan-400'}`} />
                  <span className="text-xl font-bold tracking-wide text-white">
                    {loading ? "MEMPROSES DATA..." : "JALANKAN DETEKSI"}
                  </span>
                </div>
              </button>
            )}

            {/* Hasil Analitik */}
            <div className={`flex-1 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col transition-all duration-700 ${resultImage ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
              <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2 mb-6 pb-4 border-b border-slate-800/50">
                <Target className="w-5 h-5 text-emerald-400" /> Hasil Identifikasi AI
              </h2>

              {!resultImage && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <Target className="w-16 h-16 mb-4" />
                  <p>Menunggu input citra visual...</p>
                </div>
              )}

              {resultImage && (
                <div className="flex-1 flex flex-col gap-4">
                  {detections.length > 0 ? detections.map((cat, index) => {
                    const confValue = parseFloat(cat.akurasi);
                    
                    return (
                      <div key={index} className="bg-slate-950/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-xs text-slate-500 font-mono mb-1 uppercase tracking-wider">Terdeteksi</p>
                            <h3 className="text-2xl font-bold text-cyan-300 capitalize">{cat.jenis}</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-light text-white">{confValue}</span>
                            <span className="text-sm text-cyan-500 ml-1">%</span>
                          </div>
                        </div>
                        
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 relative"
                            style={{ width: `${confValue}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 -skew-x-12 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="bg-rose-950/30 border border-rose-900/50 p-6 rounded-2xl text-center">
                      <span className="text-4xl block mb-3">⚠️</span>
                      <h3 className="text-rose-400 font-bold text-lg mb-1">Target Tidak Ditemukan</h3>
                      <p className="text-rose-500/70 text-sm">AI tidak mendeteksi bentuk kucing pada gambar ini.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      <div className="fixed bottom-4 right-4 text-xs text-slate-500">
        Fawcat &copy; 2026 - Oleh Fawwaz Muhammad Syams
      </div>
    </div>
  );
}

export default App;