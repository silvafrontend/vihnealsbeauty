/* =====================================================
   Vih Nails Beauty | script.js
   Fica na mesma pasta do index.html
   ===================================================== */
'use strict';

/* ---------- CONFIGURAÇÕES (edite aqui) ---------- */
const CONFIG = {
  whatsapp: '5551991460495',
  instagram: 'vih.nailsbeauty'
};

/* Depoimentos reais das clientes.
   Enquanto a lista estiver vazia, a seção fica escondida no site.
   Para adicionar, escreva no formato abaixo (separe por vírgula):

   { texto: 'Amei o resultado, durou muito!', nome: 'Maria' },
*/
const DEPOIMENTOS = [
];
/* ------------------------------------------------ */

const $ = (seletor, base = document) => base.querySelector(seletor);
const $$ = (seletor, base = document) => Array.from(base.querySelectorAll(seletor));
const linkWhats = (texto) =>
  `https://wa.me/${CONFIG.whatsapp}` + (texto ? `?text=${encodeURIComponent(texto)}` : '');

/* ---------- Ano no rodapé ---------- */
$('#ano').textContent = new Date().getFullYear();

/* ---------- Cabeçalho ---------- */
const topo = $('#topo');
function aoRolar() {
  topo.classList.toggle('topo--rolou', window.scrollY > 8);
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

/* ---------- Menu no celular ---------- */
const hamb = $('#hamb');
const nav = $('#nav');

function menu(abrir) {
  nav.classList.toggle('aberto', abrir);
  hamb.setAttribute('aria-expanded', String(abrir));
  hamb.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}
hamb.addEventListener('click', () => menu(!nav.classList.contains('aberto')));
$$('a', nav).forEach((a) => a.addEventListener('click', () => menu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu(false); });

/* ---------- Destaca no menu a seção que está na tela ---------- */
if ('IntersectionObserver' in window) {
  const linksMenu = $$('a', nav);
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        linksMenu.forEach((l) =>
          l.classList.toggle('ativo', l.getAttribute('href') === '#' + entrada.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach((secao) => observador.observe(secao));
}

/* ---------- Links do WhatsApp com mensagem pronta ---------- */
$$('[data-valor]').forEach((a) => {
  a.href = linkWhats(`Olá, Vih! Gostaria de saber o valor de: ${a.dataset.valor}.`);
});
$$('[data-whats]').forEach((a) => {
  a.href = linkWhats(a.dataset.whats);
});

/* ---------- Escolha de cor (início) ---------- */
const mao = $('#mao');
const corNome = $('#corNome');
const selectCor = $('#cor');
const botoesCor = $$('.cor');

function escolherCor(botao) {
  botoesCor.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
  mao.style.setProperty('--unha', botao.dataset.cor);
  corNome.textContent = botao.dataset.nome;
  selectCor.value = botao.dataset.nome;
}
botoesCor.forEach((b) => b.addEventListener('click', () => escolherCor(b)));

// Se trocar a cor no formulário, as unhas do início acompanham
selectCor.addEventListener('change', () => {
  const botao = botoesCor.find((b) => b.dataset.nome === selectCor.value);
  if (botao) escolherCor(botao);
});

/* ---------- Botões "Agendar" dos serviços já escolhem o serviço ---------- */
const selectServico = $('#servico');
$$('[data-servico]').forEach((a) => {
  a.addEventListener('click', () => { selectServico.value = a.dataset.servico; });
});

/* ---------- Depoimentos ---------- */
if (DEPOIMENTOS.length > 0) {
  const lista = $('#listaDepoimentos');
  DEPOIMENTOS.forEach((d) => {
    const figura = document.createElement('figure');
    figura.className = 'depoimento';

    const citacao = document.createElement('blockquote');
    const p = document.createElement('p');
    p.textContent = '“' + d.texto + '”';
    citacao.appendChild(p);

    const legenda = document.createElement('figcaption');
    legenda.textContent = d.nome;

    figura.append(citacao, legenda);
    lista.appendChild(figura);
  });
  $('#depoimentos').hidden = false;
}

/* ---------- Galeria: ampliar fotos ---------- */
const lightbox = $('#lightbox');
const lbImg = $('#lbImg');
let fotosAbertas = [];
let indiceAtual = 0;
let botaoOrigem = null;

function fotosComImagem() {
  return $$('.tile').filter((t) => t.querySelector('img'));
}

function mostrarFoto(indice) {
  const total = fotosAbertas.length;
  indiceAtual = (indice + total) % total;
  const img = fotosAbertas[indiceAtual].querySelector('img');
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  const varias = total > 1;
  $('#lbAnt').hidden = !varias;
  $('#lbProx').hidden = !varias;
}

function abrirLightbox(tile) {
  fotosAbertas = fotosComImagem();
  if (!fotosAbertas.length) return;
  botaoOrigem = tile;
  mostrarFoto(fotosAbertas.indexOf(tile));
  lightbox.classList.add('aberto');
  document.body.style.overflow = 'hidden';
  $('#lbFechar').focus();
}

function fecharLightbox() {
  lightbox.classList.remove('aberto');
  lbImg.src = '';
  document.body.style.overflow = '';
  if (botaoOrigem) botaoOrigem.focus();
}

$$('.tile').forEach((tile) => {
  tile.addEventListener('click', () => {
    if (tile.querySelector('img')) abrirLightbox(tile);
  });
});
$('#lbFechar').addEventListener('click', fecharLightbox);
$('#lbAnt').addEventListener('click', () => mostrarFoto(indiceAtual - 1));
$('#lbProx').addEventListener('click', () => mostrarFoto(indiceAtual + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) fecharLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('aberto')) return;
  if (e.key === 'Escape') fecharLightbox();
  if (e.key === 'ArrowLeft') mostrarFoto(indiceAtual - 1);
  if (e.key === 'ArrowRight') mostrarFoto(indiceAtual + 1);
});

/* ---------- Formulário -> WhatsApp ---------- */
const form = $('#form');
const erro = $('#erro');
const campoData = $('#data');

// Não permite escolher datas que já passaram
const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
campoData.min = hoje.toISOString().slice(0, 10);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = $('#nome').value.trim();
  const servico = selectServico.value;
  const cor = selectCor.value;
  const data = campoData.value;
  const periodo = $('#periodo').value;
  const obs = $('#obs').value.trim();

  // Confere os campos obrigatórios, um por vez
  const problemas = [
    [!nome, 'Digite seu nome.', '#nome'],
    [!servico, 'Escolha o serviço.', '#servico'],
    [!data, 'Escolha a data desejada.', '#data'],
    [data && data < campoData.min, 'Escolha uma data a partir de hoje.', '#data'],
    [!periodo, 'Escolha o período do dia.', '#periodo']
  ];
  const falha = problemas.find(([invalido]) => invalido);
  if (falha) {
    erro.textContent = falha[1];
    $(falha[2]).focus();
    return;
  }
  erro.textContent = '';

  const [ano, mes, dia] = data.split('-');
  let mensagem =
    'Olá, Vih! Vim pelo site e quero agendar:\n\n' +
    `Nome: ${nome}\n` +
    `Serviço: ${servico}\n`;
  if (cor) mensagem += `Cor: ${cor}\n`;
  mensagem += `Data: ${dia}/${mes}/${ano}\n` + `Período: ${periodo}`;
  if (obs) mensagem += `\nObservações: ${obs}`;

  const url = linkWhats(mensagem);
  const janela = window.open(url, '_blank', 'noopener');
  if (!janela) window.location.href = url; // caso o navegador bloqueie a nova aba
  form.reset();
});
