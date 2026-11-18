# `public/` — arquivos estáticos do catálogo Digo! Brindes

O Vite serve esta pasta na raiz do site.

```
public/
├── favicon.svg        # ícone da aba (mesmo desenho da logo)
├── robots.txt
├── branding/
│   └── logo.svg       # logo (círculo dourado + "D" com presente)
├── products/          # crie aqui as fotos das canecas (ex.: products/ceramica/caneca-foto.jpg)
└── assets/            # ícones, fundos e padrões (vazio)
```

## Como colocar a foto de um produto

1. Salve a foto em `public/products/...` (quadrada, 800x800 px ou maior, de preferência `.webp` ou `.jpg`).
2. No `data/products.json`, preencha `image` e `images` com o caminho **sem barra no início**:

```json
"image": "products/ceramica/caneca-foto.jpg",
"images": ["products/ceramica/caneca-foto.jpg"]
```

Produtos com `image` vazio mostram uma ilustração de caneca no lugar da foto.
Também dá para usar uma URL completa (`https://...`).
