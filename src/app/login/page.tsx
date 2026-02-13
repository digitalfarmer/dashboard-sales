import { login } from './action';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h1>
        <p className="text-slate-500 mb-8 text-sm">Silakan login untuk akses dashboard sales</p>
        
        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              name="username" 
              type="text" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}