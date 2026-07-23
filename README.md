# Jungle Diff Timer

Overlay de timers da selva para League of Legends. Fica por cima do jogo, sincroniza
o relógio sozinho pela API oficial da Riot e avisa quando cada campo nasce.

## Estrutura de arquivos

```
jungle-diff-timer/
├── package.json
├── main.js
├── preload.js
├── app/
│   ├── index.html
│   └── logo.svg
├── build/
│   ├── icon.ico      ← ícone do .exe (upload como arquivo binário)
│   └── icon.png
└── .github/
    └── workflows/
        └── build.yml
```

> Os arquivos de `build/` são imagens: no GitHub use **Add file → Upload files**,
> não "Create new file".

## Como subir pelo GitHub (sem ambiente local)

1. Crie um repositório novo: `jungle-diff-timer`.
2. **Add file → Create new file**. No campo do nome, digite o caminho completo,
   incluindo as barras — o GitHub cria as pastas sozinho.
   Exemplo: `app/index.html` e `.github/workflows/build.yml`.
3. Cole o conteúdo de cada arquivo e commit.
4. Assim que o último arquivo entrar, a aba **Actions** começa a compilar.
5. Terminou: abra a execução, baixe **JungleDiffTimer** em Artifacts, descompacte,
   rode o `.exe`. Não precisa instalar nada.

## Configuração obrigatória no LoL

Nas opções do jogo → Vídeo → **Modo de exibição: Sem Bordas**.

Em tela cheia exclusiva o Windows não deixa nenhum overlay aparecer — nem o do
Blitz. Sem Bordas não custa desempenho perceptível.

## Atalhos

| Atalho | Ação |
|---|---|
| `Ctrl + Shift + J` | Mostra / esconde o overlay |
| `Ctrl + Shift + L` | Trava / solta a posição (solto, arraste pela barra do topo) |
| `Ctrl + Shift + R` | Zera os timers |

Travado, o clique atravessa a janela e vai pro jogo. Só os campos e os botões
capturam o mouse.

## Como usar

- Entrou na partida, o overlay aparece e o relógio sincroniza sozinho.
- Limpou um campo → clique nele. Cinza = ainda não nasceu e não aceita clique.
- Amarelo = 10 segundos pro respawn. Verde = disponível.
- Segure 1 segundo (ou botão direito) pra desfazer um clique errado.
- Dragão, Grubs, Arauto e Barão se marcam automaticamente pelos eventos do jogo.

## Sobre as regras da Riot

O app lê apenas a Live Client Data API (`https://127.0.0.1:2999`), publicada pela
própria Riot para desenvolvedores. Não injeta código, não lê memória do jogo e não
automatiza nenhuma ação — os mesmos limites que Blitz e Porofessor respeitam.

## Tempos usados (Temporada 2026)

| Campo | 1º spawn | Respawn |
|---|---|---|
| Blue, Red, Lobos, Galinhas | 0:55 | Buffs 5:00 · demais 2:15 |
| Gromp, Krugs | 1:07 | 2:15 |
| Caranguejo | 2:55 | 2:35 |
| Dragão | 5:00 | 5:00 |
| Grubs | 6:00 | não renasce |
| Arauto | 15:00 | não renasce |
| Barão | 20:00 | 6:00 |
