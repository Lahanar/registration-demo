import { RegistrationForm } from './components/RegistrationForm';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative z-10">
        <RegistrationForm />
      </div>
    </div>
  );
}

export default App;
