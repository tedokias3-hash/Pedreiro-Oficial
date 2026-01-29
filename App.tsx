
import React, { useState, useEffect, useMemo } from 'react';
import { Project, Category, AdminCredentials } from './types';
import { INITIAL_PROJECTS, CATEGORIES, ADMIN_CREDENTIALS } from './constants';
import { ProjectCard } from './components/ProjectCard';
import { AdminPanel } from './components/AdminPanel';

// Logo component using the provided image link
const ConstructionLogo: React.FC<{ className?: string }> = ({ className = "w-10 h-10 md:w-12 md:h-12" }) => (
  <div className={`${className} bg-[#FACC15] rounded flex items-center justify-center p-1.5 overflow-hidden shadow-lg`}>
    <img 
      src="https://i.imgur.com/NZiOhej.png" 
      alt="Logo Pedreiro Oficial" 
      className="w-full h-full object-contain" 
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        // Fallback hidden if image fails
        target.style.display = 'none';
      }}
    />
  </div>
);

const App: React.FC = () => {
  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('po_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch (e) {
      console.error("Erro ao carregar projetos do localStorage:", e);
      return INITIAL_PROJECTS;
    }
  });
  
  // Admin Login State (Persistent)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('po_admin_session') === 'active';
  });
  
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');

  // Sync Projects to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('po_projects', JSON.stringify(projects));
    } catch (e) {
      console.error("Erro ao salvar no localStorage (provavelmente limite excedido):", e);
      alert("A memória do navegador está cheia. Tente remover algumas obras ou usar imagens menores.");
    }
  }, [projects]);

  // Handlers
  const handleAddProject = (p: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...p,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const handleEditProject = (updated: Project) => {
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta obra?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = formData.get('user') as string;
    const pass = formData.get('pass') as string;

    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
      localStorage.setItem('po_admin_session', 'active');
      setIsAdminLoggedIn(true);
      setShowLoginModal(false);
      setCurrentView('admin');
    } else {
      alert('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('po_admin_session');
    setIsAdminLoggedIn(false);
    setCurrentView('home');
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'Todos') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  const openWhatsApp = () => {
    const msg = encodeURIComponent("Olá Pedreiro Oficial, vi seu portfólio e gostaria de um orçamento.");
    window.open(`https://wa.me/5500000000000?text=${msg}`, '_blank');
  };

  // If already logged in and current view is admin, show AdminPanel
  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminPanel 
        projects={projects}
        onAdd={handleAddProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <nav className="fixed top-0 w-full z-40 bg-[#121212]/90 backdrop-blur-md border-b border-white/5 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
             <ConstructionLogo className="w-9 h-9 md:w-11 md:h-11" />
             <span className="text-lg md:text-xl font-black uppercase tracking-tighter">Pedreiro <span className="text-[#FACC15]">Oficial</span></span>
          </div>
          <button 
            onClick={() => isAdminLoggedIn ? setCurrentView('admin') : setShowLoginModal(true)}
            className={`${isAdminLoggedIn ? 'text-[#FACC15]' : 'text-gray-500'} hover:text-[#FACC15] transition-colors p-2`}
            title={isAdminLoggedIn ? "Ir para o Painel" : "Fazer Login"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 text-center overflow-hidden py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-4xl space-y-6 md:space-y-8">
          <div className="inline-block p-3 bg-[#FACC15] mb-2 md:mb-4 animate-bounce rounded-2xl shadow-2xl overflow-hidden">
             <img 
               src="https://i.imgur.com/NZiOhej.png" 
               className="w-16 h-16 md:w-28 md:h-28 object-contain" 
               alt="Hero Logo" 
             />
          </div>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[1.1] md:leading-none">
            Transformando sua casa com <span className="text-[#FACC15]">profissionalismo oficial</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto px-4">
            Reformas de alto padrão com acabamento impecável e garantia de qualidade.
          </p>
          <button 
            onClick={openWhatsApp}
            className="group relative inline-flex items-center gap-3 bg-[#FACC15] text-[#121212] px-6 py-4 md:px-8 md:py-5 rounded-none font-black text-base md:text-lg uppercase transition-all hover:pr-12 w-full md:w-auto justify-center"
          >
            Peça seu orçamento
            <svg className="w-5 h-5 md:w-6 md:h-6 absolute right-4 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 md:py-24 px-4 md:px-6 bg-[#121212]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-6 md:gap-8">
            <div className="space-y-3 md:space-y-4">
              <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter">Obras Entregues</h2>
              <div className="h-1.5 md:h-2 w-24 md:w-32 bg-[#FACC15]"></div>
              <p className="text-gray-500 max-w-md text-sm md:text-base">Confira os resultados reais de quem prioriza qualidade técnica e estética em cada detalhe.</p>
            </div>
            
            {/* Filter Buttons - Horizontal scroll on mobile */}
            <div className="flex overflow-x-auto pb-4 md:pb-0 gap-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 text-xs md:text-sm font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    activeCategory === cat 
                    ? 'bg-[#FACC15] text-[#121212] border-[#FACC15]' 
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-[#FACC15] hover:text-[#FACC15]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="col-span-full py-16 md:py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs md:text-base px-6">Nenhuma obra encontrada nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-16 md:py-20 px-4 md:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <ConstructionLogo className="w-10 h-10 md:w-12 md:h-12" />
               <span className="text-xl font-black uppercase tracking-tighter">Pedreiro <span className="text-[#FACC15]">Oficial</span></span>
            </div>
            <p className="text-gray-500 leading-relaxed text-sm md:text-base">Especialista em reformas residenciais e comerciais. Do alicerce ao acabamento fino, cuidamos do seu sonho com rigor técnico.</p>
            <div className="flex gap-4">
              {['Instagram', 'Facebook', 'LinkedIn'].map(social => (
                <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#FACC15] hover:text-[#121212] transition-all text-gray-400">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#FACC15]">Atendimento</h3>
            <ul className="space-y-4 text-gray-400 text-sm md:text-base">
              <li className="flex items-start gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FACC15] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>Atendemos em toda São Paulo, ABC e Interior (consulte sua região).</span>
              </li>
              <li className="flex items-start gap-4">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FACC15] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>(11) 99999-9999</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-[#FACC15]">Acabamento Oficial</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white/5 overflow-hidden">
                  <img src={`https://picsum.photos/id/${10+i}/200/200`} alt="Preview" className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-[10px] md:text-xs text-gray-600 uppercase font-bold tracking-[0.2em] px-4">
          &copy; {new Date().getFullYear()} Pedreiro Oficial. Todos os direitos reservados.
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button 
        onClick={openWhatsApp}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 bg-[#25D366] text-white p-3.5 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.432h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <form 
            onSubmit={handleLogin}
            className="bg-[#1a1a1a] p-6 md:p-10 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest italic">Acesso Restrito</h2>
              <button type="button" onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-white p-2">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Usuário</label>
                <input 
                  type="text" name="user" required 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 md:p-4 text-white focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Senha</label>
                <input 
                  type="password" name="pass" required 
                  className="w-full bg-black/50 border border-white/10 rounded p-3 md:p-4 text-white focus:outline-none focus:border-[#FACC15]"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#FACC15] text-[#121212] font-black py-3.5 md:py-4 rounded-none hover:bg-yellow-400 transition-colors uppercase tracking-widest text-sm md:text-base"
            >
              Entrar no Painel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
