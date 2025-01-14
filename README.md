# Análise dos Territórios Quilombolas

Este repositório contém códigos, dados e documentações relacionados à análise de territórios quilombolas no Brasil, incluindo informações sobre biomas, séries temporais e tipos de uso da terra.

## Conteúdo do Repositório

- **Scripts e Documentos:** Scripts desenvolvidos para a análise espacial e temporal dos territórios quilombolas. Acesse a pasta principal no GitHub: [Clique aqui](https://github.com/wallyboy22/analises_sobre_territorios_quilombolas/tree/main)
- **Dados no Google Drive:** Documentos e recursos complementares. [Acesse aqui](https://drive.google.com/drive/folders/16gLlgNr_Y5SnnrfmthSRHuHaZqL1R-MH)

## Acesso aos Dados

- **Territórios Quilombolas:**
  - [Download em formato SHP/CSV](https://certificacao.incra.gov.br/csv_shp/export_shp.py)
  - [Dados no Google Earth Engine](https://code.earthengine.google.com/?asset=projects/ee-babecsilva-consultorias/assets/incra_areas_de_quilombolas)

- **Séries Temporais:**
  - Buffers de 10 km: [Buffer somente](https://code.earthengine.google.com/?asset=projects/ee-babecsilva-consultorias/assets/incra_areas_de_quilombolas_somente_buffer_10km) | [Buffer completo](https://code.earthengine.google.com/?asset=projects/ee-babecsilva-consultorias/assets/incra_areas_de_quilombolas_buffer_10km)
  - Código para aplicar buffers: [Script no GitHub](https://github.com/wallyboy22/analises_sobre_territorios_quilombolas/blob/main/scripts/apply_buffer_in_shape.js)

- **Biomas:**
  - [Download em formato SHP/CSV](https://certificacao.incra.gov.br/csv_shp/export_shp.py)
  - [Dados no Google Earth Engine](https://code.earthengine.google.com/?asset=projects/ee-babecsilva-consultorias/assets/ISA/ibge_biomas_250mil)

## Análise por Tipo de Uso

- [Código no GitHub](https://github.com/wallyboy22/analises_sobre_territorios_quilombolas/blob/main/scripts/LULC-incra_areas_de_quilombolas_buffer.js)

## Como Contribuir

1. Faça um fork deste repositório.
2. Crie um branch para suas alterações: `git checkout -b feature/nova-analise`
3. Commit suas mudanças: `git commit -m 'Adiciona nova análise'`
4. Faça push para o branch: `git push origin feature/nova-analise`
5. Envie um pull request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

Para mais informações, entre em contato com [ISA]().
