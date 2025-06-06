'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type PedidoStatus = 'pendente' | 'em_preparo' | 'concluido'

export interface Pedido {
  id: string
  cliente: string
  mesa: number
  itens: string[]
  status: PedidoStatus
  createdAt: string
}

interface PedidoContextType {
  pedidos: Pedido[]
  fetchPedidos: () => Promise<void>
  adicionarPedido: (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => Promise<void>
  removerPedido: (id: string) => Promise<void>
  atualizarStatusPedido: (id: string, status: PedidoStatus) => Promise<void>
  gerarComprovante: (id: string) => Promise<void> 
  erroComprovante?: string | null;
}

const PedidoContext = createContext<PedidoContextType>({
  pedidos: [],
  fetchPedidos: async () => {},
  adicionarPedido: async () => {},
  removerPedido: async () => {},
  atualizarStatusPedido: async () => {},
  gerarComprovante: async () => {},
})

export function PedidoProvider({ children }: { children: React.ReactNode }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
 const [erroComprovante, setErroComprovante] = useState<string | null>(null);
  const [gerandoComprovante, setGerandoComprovante] = useState<string | null>(null);

  const fetchPedidos = useCallback(async () => {
    try {
      const response = await fetch('/api/pedidos')
      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos')
      }
      const data = await response.json()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
      throw error
    }
  }, [])

 

  const adicionarPedido = useCallback(async (pedido: Omit<Pedido, 'id' | 'status' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido),
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar pedido')
      }

      const novoPedido = await response.json()
      setPedidos(prev => [...prev, novoPedido])
      return novoPedido
    } catch (error) {
      console.error('Erro ao adicionar pedido:', error)
      throw error
    }
  }, [])

  const removerPedido = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/pedidos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao remover pedido')
      }

      setPedidos(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Erro ao remover pedido:', error)
      throw error
    }
  }, [])

  const atualizarStatusPedido = useCallback(async (id: string, status: PedidoStatus) => {
    try {
      const response = await fetch('/api/pedidos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar status do pedido')
      }

      const data = await response.json()
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, status } : p))
      return data
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchPedidos()
  }, [fetchPedidos])


  //  const gerarComprovante = useCallback(async (id: string) => {
  //     try {
  //       setErroComprovante(null);
  //       setGerandoComprovante(id); // Adicione esta linha se estiver usando estado de loading
        
  //       const response = await fetch('/api/gerar-comprovante', {
  //         method: 'POST',
  //         headers: { 
  //           'Content-Type': 'application/json',
  //          'Accept': 'application/pdf'
  //          },
  //         body: JSON.stringify({ id }),
  //       });

  //       console.log('Resposta recebida:', response);
  //       // Verificação rigorosa do response
  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => null);
  //         throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
  //       }

  //       // Verifica se é PDF (dupla verificação)
  //       const contentType = response.headers.get('content-type');
  //       const contentDisposition = response.headers.get('content-disposition');
        
  //       if (contentType?.includes('application/pdf') || contentDisposition?.includes('filename=.pdf')) {
  //         const blob = await response.blob();
  //         const url = window.URL.createObjectURL(blob);
          
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.setAttribute('download', `comprovante-${id}.pdf`);
  //         document.body.appendChild(link);
  //         link.click();
  //         document.body.removeChild(link);
  //         window.URL.revokeObjectURL(url);
          
  //         return; // Saída bem-sucedida
  //       }

  //       // Se chegou aqui, a resposta não é um PDF válido
  //       const responseData = await response.text();
  //       throw new Error(`Resposta inesperada: ${responseData.substring(0, 100)}...`);

  //     } catch (error) {
  //       console.error('Erro detalhado:', error);
  //       setErroComprovante(error instanceof Error ? error.message : 'Erro desconhecido');
  //       throw error; // Rejeita a promise para tratamento externo
  //     } finally {
  //       setGerandoComprovante(null); // Remove o loading
  //     }
  //   }, []);
// const gerarComprovante = useCallback(async (id: string) => {
//   try {
//     setErroComprovante(null);
//     setGerandoComprovante(id);
    
//     const response = await fetch('/api/gerar-comprovante', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id }),
//     });

//     if (!response.ok) {
//       // Tenta ler como JSON, se falhar lê como texto
//       const errorData = await response.json().catch(async () => ({
//         message: await response.text()
//       }));
//       throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
//     }

//     const blob = await response.blob();
//     const url = window.URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `comprovante-${id}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
    
//   } catch (error) {
//     console.error('Erro detalhado:', error);
//     setErroComprovante(error instanceof Error ? error.message : 'Erro desconhecido');
//     throw error;
//   } finally {
//     setGerandoComprovante(null);
//   }
// }, []);
const gerarComprovante = useCallback(async (id: string) => {
  try {
    setErroComprovante(null);
    setGerandoComprovante(id);
    
    const response = await fetch('/api/gerar-comprovante', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao gerar comprovante');
    }

    // Processar PDF
     // Verifica se é PDF (dupla verificação)
        const contentType = response.headers.get('content-type');
        const contentDisposition = response.headers.get('content-disposition');
        
        if (contentType?.includes('application/pdf') || contentDisposition?.includes('filename=.pdf')) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `comprovante-${id}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          return; // Saída bem-sucedida
        }

        // Se chegou aqui, a resposta não é um PDF válido
        const responseData = await response.text();
        throw new Error(`Resposta inesperada: ${responseData.substring(0, 100)}...`);
    
  } catch (error) {
    setErroComprovante(error.message);
    throw error;
  } finally {
    setGerandoComprovante(null);
  }
}, []);

  return (
    <PedidoContext.Provider value={{ 
      pedidos, 
      fetchPedidos, 
      adicionarPedido, 
      removerPedido,
      atualizarStatusPedido,
      gerarComprovante,
      erroComprovante
    }}>
      {children}
    </PedidoContext.Provider>
  )
}

export const usePedidoContext = () => useContext(PedidoContext)




