export const DEFAULT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; padding: 20px;">
  <h1 style="text-align: center;">ДОГОВОР АРЕНДЫ № {{order_number}}</h1>
  <p><strong>Клиент:</strong> {{last_name}} {{first_name}}</p>
  <p><strong>Сумма заказа:</strong> {{total_price}} руб.</p>
  <hr />
  <h3>Список оборудования:</h3>
  {{#each items}}
    <p>{{this.name}} — {{this.price}} руб. (с {{this.start_date}} по {{this.end_date}})</p>
  {{/each}}
  <p style="margin-top: 50px;">Подпись: _________________</p>
</div>
`.trim();
