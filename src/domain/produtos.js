// Catálogo inicial da ShopQA (dados de demonstração).
// O estoque "vivo" fica no localStorage (ver services/api.js); estes valores são o seed.

export const CATEGORIAS = ['Eletrônicos', 'Informática', 'Casa', 'Esporte', 'Livros'];

export const PRODUTOS = [
  { id: 1, nome: 'Fone Bluetooth Pro', categoria: 'Eletrônicos', preco: 299.0, estoque: 25, vendidos: 340, emoji: '🎧', descricao: 'Fone over-ear com cancelamento de ruído ativo e 30h de bateria.' },
  { id: 2, nome: 'Smartwatch Fit 2', categoria: 'Eletrônicos', preco: 649.9, estoque: 12, vendidos: 210, emoji: '⌚', descricao: 'Monitor cardíaco, GPS integrado e resistência à água 5ATM.' },
  { id: 3, nome: 'Notebook Ultra 14"', categoria: 'Informática', preco: 4299.0, estoque: 4, vendidos: 58, emoji: '💻', descricao: 'Processador de 8 núcleos, 16 GB RAM, SSD 512 GB.' },
  { id: 4, nome: 'Mouse Óptico Sem Fio', categoria: 'Informática', preco: 89.9, estoque: 60, vendidos: 820, emoji: '🖱️', descricao: 'Sensor de 1600 DPI, pilha inclusa.' },
  { id: 5, nome: 'Teclado Mecânico RGB', categoria: 'Informática', preco: 349.9, estoque: 15, vendidos: 190, emoji: '⌨️', descricao: 'Switches marrons, layout ABNT2.' },
  { id: 6, nome: 'Cafeteira Elétrica', categoria: 'Casa', preco: 199.0, estoque: 20, vendidos: 300, emoji: '☕', descricao: 'Capacidade para 30 xícaras, função manter aquecido.' },
  { id: 7, nome: 'Jogo de Panelas Antiaderente', categoria: 'Casa', preco: 459.0, estoque: 8, vendidos: 95, emoji: '🍳', descricao: 'Conjunto com 5 peças, compatível com indução.' },
  { id: 8, nome: 'Luminária de Mesa LED', categoria: 'Casa', preco: 129.9, estoque: 30, vendidos: 150, emoji: '💡', descricao: 'Três temperaturas de cor e braço articulado.' },
  { id: 9, nome: 'Bola de Futebol Oficial', categoria: 'Esporte', preco: 149.9, estoque: 40, vendidos: 410, emoji: '⚽', descricao: 'Tamanho 5, costurada à mão.' },
  { id: 10, nome: 'Tênis de Corrida Ágil', categoria: 'Esporte', preco: 399.9, estoque: 3, vendidos: 260, emoji: '👟', descricao: 'Amortecimento responsivo, numeração 34 a 44.' },
  { id: 11, nome: 'Garrafa Térmica 1L', categoria: 'Esporte', preco: 79.9, estoque: 100, vendidos: 900, emoji: '🧴', descricao: 'Mantém a temperatura por até 12 horas.' },
  { id: 12, nome: 'Livro: Testes de Software na Prática', categoria: 'Livros', preco: 59.9, estoque: 50, vendidos: 120, emoji: '📘', descricao: 'Técnicas de teste, automação e qualidade contínua.' },
  { id: 13, nome: 'Livro: Inteligência Artificial para Iniciantes', categoria: 'Livros', preco: 74.5, estoque: 0, vendidos: 75, emoji: '📗', descricao: 'Conceitos de IA explicados sem matemática pesada.' },
  { id: 14, nome: 'Cadeira Ergonômica Office', categoria: 'Casa', preco: 1299.9, estoque: 6, vendidos: 44, emoji: '🪑', descricao: 'Apoio lombar ajustável e braços 3D.' }
];
