
import React, { useState, useRef } from 'react';
import { Project, Category } from '../types';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  projects: Project[];
  onAdd: (p: Omit<Project, 'id' | 'createdAt'>) => void;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ projects, onAdd, onEdit, onDelete, onLogout }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Banheiros');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTitle('');
    setCategory('Banheiros');
    setBeforeImage('');
    setAfterImage('');
    setEditingProject(null);
    setIsFormOpen(false);
    setIsProcessing(false);
    if (beforeInputRef.current) beforeInputRef.current.value = '';
    if (afterInputRef.current) afterInputRef.current.value = '';
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Use image/jpeg with 0.7 quality to significantly reduce size
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressedBase64 = await compressImage(file);
        if (type === 'before') {
          setBeforeImage(compressedBase64);
        } else {
          setAfterImage(compressedBase64);
        }
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert("Erro ao processar a imagem. Tente outro arquivo.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeImage || !afterImage) {
      alert('Por favor, faça upload de ambas as imagens (Antes e Depois).');
      return;
    }

    if (editingProject) {
      onEdit({ ...editingProject, title, category, beforeImage, afterImage });
    } else {
      onAdd({ title, category, beforeImage, afterImage });
    }
    resetForm();
  };

  const handleEditClick = (p: Project) => {
    setEditingProject(p);
    setTitle(p.title);
    setCategory(p.category);
    setBeforeImage(p.beforeImage);
    setAfterImage(p.afterImage);
    setIsFormOpen(true);
  };

  return (
    <div className="bg-[#121212] min-h-screen p-4 md:p-8 pt-20 md:pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#FACC15]">PAINEL ADMIN</h1>
            <p className="text-gray-400 text-sm md:text-base">Gerencie seu portfólio oficial</p>
          </div>
          <div className="flex w-full md:w-auto gap-3 md:gap-4">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex-1 md:flex-none bg-[#FACC15] text-[#121212] font-black px-4 md:px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors text-sm md:text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
              NOVA OBRA
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 md:flex-none border border-red-500/50 text-red-500 px-4 md:px-6 py-3 rounded-lg font-bold hover:bg-red-500/10 transition-colors text-sm md:text-base"
            >
              SAIR
            </button>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto py-10">
            <form 
              onSubmit={handleSubmit}
              className="bg-[#1a1a1a] p-6 md:p-8 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl space-y-4 my-auto"
            >
              <h2 className="text-xl md:text-2xl font-black text-white mb-4 uppercase">
                {editingProject ? 'Editar Obra' : 'Nova Obra'}
              </h2>
              
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Título da Obra</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Reforma Banheiro Suite"
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FACC15] text-sm md:text-base"
                />
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Categoria</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value as Category)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FACC15] text-sm md:text-base"
                >
                  {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Foto Antes</label>
                  <div className={`relative aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                    {beforeImage ? (
                      <img src={beforeImage} className="w-full h-full object-cover" alt="Preview Antes" />
                    ) : (
                      <div className="text-center p-2">
                        <svg className="w-6 h-6 text-gray-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[8px] text-gray-500 font-bold uppercase">{isProcessing ? 'Processando...' : 'Upload'}</span>
                      </div>
                    )}
                    <input 
                      type="file" accept="image/*" ref={beforeInputRef}
                      onChange={(e) => handleFileChange(e, 'before')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Foto Depois</label>
                  <div className={`relative aspect-video bg-black/50 border-2 border-dashed border-white/10 rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                    {afterImage ? (
                      <img src={afterImage} className="w-full h-full object-cover" alt="Preview Depois" />
                    ) : (
                      <div className="text-center p-2">
                        <svg className="w-6 h-6 text-gray-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[8px] text-gray-500 font-bold uppercase">{isProcessing ? 'Processando...' : 'Upload'}</span>
                      </div>
                    )}
                    <input 
                      type="file" accept="image/*" ref={afterInputRef}
                      onChange={(e) => handleFileChange(e, 'after')}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-4">
                <button 
                  type="button" onClick={resetForm}
                  className="order-2 md:order-1 flex-1 bg-white/5 text-white font-bold py-3 rounded-lg hover:bg-white/10 transition-colors text-sm md:text-base"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className={`order-1 md:order-2 flex-1 bg-[#FACC15] text-[#121212] font-black py-3 rounded-lg hover:bg-yellow-400 transition-colors text-sm md:text-base ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? 'AGUARDE...' : 'SALVAR'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map(p => (
            <div key={p.id} className="relative group">
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 hover:border-[#FACC15]/30 transition-all">
                 <img src={p.afterImage} className="w-full aspect-video object-cover" alt={p.title} />
                 <div className="p-4 flex justify-between items-center">
                   <div className="flex-1 min-w-0 pr-2">
                     <p className="text-[#FACC15] text-[10px] uppercase font-bold truncate">{p.category}</p>
                     <h3 className="font-bold text-white truncate text-sm md:text-base">{p.title}</h3>
                   </div>
                   <div className="flex gap-1">
                     <button onClick={() => handleEditClick(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors" title="Editar">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                     </button>
                     <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Excluir">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
               <p className="text-gray-500 font-bold">Nenhum projeto cadastrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
