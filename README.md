# Cresça Soluções — Landing Page

Landing page estática em HTML/CSS/JS (vanilla) com uma micro lib reativa chamada "markup" para bindings simples. Conteúdo em PT-BR, focado em conversão.

## Como rodar localmente

Você já tem tudo no diretório raiz. Use um servidor estático simples:

```bash
# Opção Python 3
cd /home/jonorusc/projects/crescaweb
python3 -m http.server 5173

# Ou com Node (se tiver instalado)
# npx serve -l 5173
```

Abra no navegador: http://localhost:5173

## Personalizações rápidas

- WhatsApp: edite `WHATSAPP_NUMBER` em [script.js](script.js#L4) (formato `55DDDNUMERO`, ex: `5599999999999`).
- Formulário: edite `FORM_ENDPOINT` em [script.js](script.js#L3) para usar Formspree (ou similar). Sem endpoint, o fallback abre o cliente de e-mail.
- Domínio/SEO: atualize `canonical`, Open Graph e `JSON-LD` em [index.html](index.html) quando publicar.
- Cores e estilo: ajuste variáveis de cor em [styles.css](styles.css#L2) e componentes conforme necessidade.
- Logo/Favicon: substitua os arquivos em [assets/logo.svg](assets/logo.svg) e [assets/favicon.svg](assets/favicon.svg).

## Estrutura

- [index.html](index.html): marcação principal, seções e metadados.
- [styles.css](styles.css): estilos responsivos, dark theme, componentes.
- [script.js](script.js): interação básica, micro lib `markup`, formulário e navegação.
- [assets/](assets): ícones e imagens.
- [robots.txt](robots.txt): diretivas de indexação (ajuste sitemap após deploy).

## Deploy

Qualquer hospedagem estática funciona (Netlify, Vercel, GitHub Pages, S3/CloudFront, etc.).

Passos gerais:

1. Faça o build (não há build — é estático).
2. Suba os arquivos da raiz (incluindo pasta `assets`).
3. Atualize `canonical`, OG e sitemap em produção.

## Observações

- A "markup" aqui é uma micro implementação local para bindings via `data-bind` e repetições com `data-repeat`. Se preferir, podemos trocar para uma lib de template/reatividade existente via CDN.
- O conteúdo dos depoimentos/FAQ está como placeholder. Envie seus textos para publicarmos.