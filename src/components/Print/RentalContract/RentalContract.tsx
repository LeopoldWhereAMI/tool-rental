"use client";

import styles from "./RentalContract.module.css";
import { ContractItem, ContractOrderData } from "@/types";
import { priceToWords } from "@/helpers";

interface Props {
  items: ContractItem[];
  orderData: ContractOrderData;
}

const RentalContract = ({ items, orderData }: Props) => {
  // Форматируем дату
  const now = new Date();
  const formattedDate = now.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const getItemDetails = (item: ContractItem) => {
    const startDate = item.start_date;
    const endDate = item.end_date;
    const price = Number(item.price_at_time || item.daily_price || 0);

    let days = 1;
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = e.getTime() - s.getTime();
      days = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
    }

    return { startDate, endDate, price, days, rowTotal: price * days };
  };

  const totalPurchasePrice = items.reduce(
    (sum, item) => sum + Number(item.purchase_price || 0),
    0,
  );

  // Считаем сумму посуточной аренды всех выбранных инструментов
  // const totalDailyPrice = items.reduce(
  //   (sum, item) => sum + Number(item.daily_price || 0),
  //   0,
  // );

  const maxEndDate = items.length
    ? [...items].sort(
        (a, b) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
      )[0].end_date
    : null;

  const { adjustment, total_price, order_number } = orderData;
  // Превращаем в числа, чтобы избежать NaN при расчетах
  const adjValue = Number(adjustment) || 0;
  const totalValue = Number(total_price) || 0;

  return (
    <div className={styles.printWrapper}>
      <article className={styles.container}>
        {/* Заголовок и метаданные */}
        <header className={styles.header}>
          <div className={styles.flexBetween}>
            <h1 className={styles.title}>Договор № {order_number}</h1>
          </div>
          <div className={styles.flexBetween}>
            <span>г. Железногорск</span>
            <span>
              «{hours}» часов «{minutes}» минут « {formattedDate} »
            </span>
          </div>
        </header>

        {/* Стороны договора */}
        <section className={styles.section}>
          <p className={styles.textIndent}>
            Индивидуальный предприниматель Голубева Максима Анатольевича, в лице
            Голубева М. А., действующего на основании свидетельства ОГРНИП
            318463200012946, с одной стороны, именуемый в дальнейшем{" "}
            <strong>«Пункт проката»</strong>, и
          </p>

          <p className={`${styles.textIndent} ${styles.underline}`}>
            {orderData.last_name} {orderData.first_name}{" "}
            {orderData.middle_name || ""}
          </p>
          <p className={styles.textIndent}>
            именуемый в дальнейшем <strong>«Клиент»</strong>, паспорт: серия{" "}
            <strong>{orderData.passport_series}</strong> №{" "}
            <strong>{orderData.passport_number}</strong> выдан:{" "}
            <strong>{orderData.issued_by}</strong>, когда{" "}
            <strong>{orderData.issue_date}</strong> зарегистрирован по адресу:{" "}
            <strong>{orderData.registration_address}</strong>
          </p>
          <p>с другой стороны, заключили настоящий Договор о нижеследующем:</p>
        </section>

        {/* 1. ПРЕДМЕТ ДОГОВОРА */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. ПРЕДМЕТ ДОГОВОРА</h2>
          <p>
            1.1. Пункт проката обязуется предоставить Клиенту, за плату во
            временное пользование следующее движимое имущество, именуемое в
            дальнейшем «Имущество»:
          </p>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>№ п/п</th>
                <th>Наименование</th>
                <th>Стоимость имущества, руб.</th>
                <th>Инв. номер</th>
                <th>Дата и время возврата</th>
                <th>Стоимость проката, сутки/сумма/руб.</th>
                <th>Сумма обеспечительного платежа, руб.</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const details = getItemDetails(item); // Используем нашу функцию

                return (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.purchase_price} руб.</td>
                    <td>{item.article || item.serial_number || "—"}</td>
                    <td>
                      {details.endDate
                        ? new Date(details.endDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>{details.price} руб./сутки</td>
                    {/* ВЫВОДИМ СУММУ ЗА ВЕСЬ СРОК ДЛЯ ЭТОГО ИНСТРУМЕНТА */}
                    <td>{details.rowTotal} руб.</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p>
            Стоимость Имущества, предоставляемая по настоящему Договору,
            определяется в соответствии с рыночной стоимостью и составляет{" "}
            <strong>{totalPurchasePrice} руб.</strong> (
            <strong>
              {priceToWords(Number(totalPurchasePrice))} рублей 00 копеек
            </strong>
            )
          </p>
          <ul className={styles.list}>
            <li>
              1.2. Имущество используется Клиентом по прямому назначению в
              соответствии с правилами эксплуатации.
            </li>
            <li>
              1.3. Исправность сдаваемого в прокат Имущества проверена Клиентом
              при получении.
            </li>
            <li>
              1.4. Клиент ознакомлен с правилами эксплуатации и хранения
              Имущества, правилами техники безопасности при работе с Имуществом.
            </li>
            <li>
              1.5. Пункт проката не несет ответственность за травмы и несчастные
              случаи, произошедшие с Клиентом, Пункт проката не несет
              ответственность за вред, причиненный третьим лицам и их имуществу
              с помощью Имущества Пункта проката.
            </li>
            <li>
              1.6. Имущество передается Клиенту и возвращается в Пункт проката
              по адресу: г. Железногорск Курская область , ул. Мира 6 А –
              Мастерская № 1.
            </li>
          </ul>
        </section>

        {/* 2. ОПЛАТА ПРОКАТА, ОБЕСПЕЧИТЕЛЬНЫЙ ПЛАТЕЖ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. ОПЛАТА ПРОКАТА, ОБЕСПЕЧИТЕЛЬНЫЙ ПЛАТЕЖ
          </h2>
          <p>
            2.1. За прокат Имущества Клиент уплачивает общую сумму в размере{" "}
            <strong>{orderData.total_price} руб./сутки</strong> (согласно
            стоимости каждой единицы, указанной в п. 1.1 настоящего Договора) в
            соответствии с прейскурантом цен на услуги.
          </p>
          {/* Добавляем расшифровку, если есть скидка или наценка */}
          {adjustment !== 0 && (
            <div className={styles.adjustmentLine}>
              <span>
                * С учетом{" "}
                {adjValue > 0
                  ? "дополнительной наценки"
                  : "предоставленной скидки"}{" "}
                в размере <strong>{Math.abs(adjValue)} руб.</strong>
                (Базовая стоимость проката: {totalValue - adjValue} руб.)
              </span>
            </div>
          )}
          <p>
            2.2. Стоимость проката взимается при заключении настоящего Договора
            или в соответствии со счетом, предоставленным Пунктом проката.
          </p>
          <p>
            2.3. При продлении Договора Клиент производит доплату за
            дополнительное время использования прокатного Имущества.
          </p>
          <p>
            2.4. Оплата производится наличными денежными средствами в кассу
            Пункта проката, либо платежным безналичным перечислением на
            расчетный счет Пункта проката не позднее 3 (трёх) рабочих дней с
            момента возврата Имущества.
          </p>
          <p>
            2.5. В случае досрочного возврата Имущества Клиентом Пункт проката
            возвращает ему соответствующую часть полученной стоимости проката,
            исчисляя ее со дня, следующего за днем фактического возврата
            Имущества.
          </p>
          <p>
            2.6. В целях обеспечения надлежащего исполнения Клиентом своих
            обязательств по настоящему договору Клиент вносит Пункту проката
            Обеспечительный платеж в размере{" "}
            <strong>{orderData.total_price}</strong> руб.
            <strong>
              {" "}
              ({priceToWords(Number(orderData.total_price))} рублей 00 копеек
            </strong>
            )
          </p>
          <p>
            2.7. Обеспечительный платеж не является задатком в значении, данном
            этому термину в статьях 380, 381 Гражданского кодекса РФ. Проценты
            на сумму Обеспечительного платежа не начисляются.
          </p>
          <p>
            2.8. При ненадлежащем исполнении Клиентом своих обязательств по
            настоящему договору Обеспечительный платеж признается компенсацией
            ущерба Пункта проката.
          </p>
          <p>
            2.9. Пункт проката вправе производить отчисления из суммы
            Обеспечительного платежа на покрытие стоимости ущерба, причиненного
            Клиентом или третьими лицами в период проката Имущества и на
            покрытие сумм задолженности Клиента перед Пунктом проката, включая
            неустойку, предусмотренную п. 5.1, 5.2, 4.2.4 договора.
          </p>
          <p>
            2.10. При надлежащем исполнении Клиентом своих обязательств по
            настоящему Договору, а также в случае, если суммы отчислений,
            произведенных Клиентом менее суммы Обеспечительного платежа, остаток
            Обеспечительного платежа возвращается Клиенту в момент возврата
            Имущества в Пункт проката.
          </p>
        </section>

        {/* 3. СРОКИ ИСПОЛНЕНИЯ ОБЯЗАТЕЛЬСТВ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            3. СРОКИ ИСПОЛНЕНИЯ ОБЯЗАТЕЛЬСТВ
          </h2>

          <p>
            3.1. Настоящий Договор вступает в силу с момента подписания и
            действует до полного исполнения обязательств по последнему возврату
            Имущества (крайний срок:{" "}
            <strong>
              {maxEndDate
                ? `${new Date(maxEndDate).toLocaleDateString("ru-RU")} «${hours}» часов «${minutes}» минут`
                : "—"}
            </strong>
            ).
          </p>
          <p>
            3.2. Указанное в п.1.1 настоящего Договора Имущество должно быть
            передано Клиенту в течение 24 часов после подписания настоящего
            Договора и Акта приема-передачи Имущества, а также внесения
            обеспечительного платежа.
          </p>
        </section>

        {/* 4. ОБЯЗАННОСТИ СТОРОН */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. ОБЯЗАННОСТИ СТОРОН</h2>
          <p>4.1. Пункт проката обязан:</p>
          <p>
            4.1.1. В присутствии Клиента проверить исправность Имущества,
            отсутствие внешних дефектов, комплектность; ознакомить Клиента с
            правилами предоставления Имущества в прокат, эксплуатации и
            стоимостью проката Имущества.
          </p>
          <p>4.2. Клиент обязан:</p>
          <ul>
            <li>
              4.2.1. При поломке имущества известить Пункт проката и сдать
              Имущество в течение 12 часов для выяснения причин поломки;
            </li>
            <li>
              4.2.2. Эксплуатировать полученное Имущество в соответствии с
              правилами его эксплуатации и техническими характеристиками;
              следить за целостностью и сохранностью, не допуская замены деталей
              и вскрытия;
            </li>
            <li>
              4.2.3. За время диагностики, доставки и ремонта Клиент обязан
              оплатить полную стоимость проката Имущества до момента возврата в
              Пункт проката;
            </li>
            <li>
              4.2.4. Если недостатки явились следствием нарушения правил
              эксплуатации, Клиент оплачивает стоимость диагностики, ремонта и
              транспортировки;
            </li>
            <li>
              4.2.5. Клиент обязан проходить профилактический осмотр Имущества
              каждые 5 суток. Запрещается использовать собственную бензосмесь
              для 2х-тактных двигателей. Нарушив данный пункт, Клиент берет на
              себя обязательства по ремонту вне зависимости от причин поломки;
            </li>
            <li>
              4.2.6. Клиент обязан вернуть Имущество в пригодном для
              эксплуатации состоянии, в чистом виде. В противном случае
              взимается плата за чистку в размере 500 руб. за единицу.
            </li>
          </ul>
        </section>

        {/* 5. ОТВЕТСТВЕННОСТЬ СТОРОН */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. ОТВЕТСТВЕННОСТЬ СТОРОН</h2>
          <p>
            5.1. В случае невозвращения Имущества в срок, Пункт проката вправе
            начислить штрафную неустойку в размере 10% от стоимости Имущества за
            каждый день просрочки.
          </p>
          <p>
            5.2. При возврате Имущества, в случае неоплаты стоимости проката,
            взимается плата в размере 10% от стоимости Имущества за каждый день
            просрочки.
          </p>
          <p>
            5.3. Все риски, связанные с потерей, кражей, порчей или повреждением
            Имущества, принимает на себя Клиент.
          </p>
          <p>
            5.4. Клиент подтверждает, что не лишен дееспособности и не страдает
            заболеваниями, препятствующими осознать суть договора.
          </p>
        </section>

        {/* Реквизиты и подписи */}
        <section className={styles.grid}>
          <div>
            <h3>«Пункт проката Мастерская № 1»</h3>
            <p>ИП Голубев Максим Анатольевич</p>
            <p>307177, г Железногорск ул. Мира 6 А</p>
            <p>ОГРН: 318463200012946</p>
            <p>ИНН: 463310485078</p>
            <p>Тел: +7(930)852-22-96</p>
            <p>Р/Счет: 40802 810 8 3300 0005073</p>
            <div style={{ marginTop: "20px" }}>
              <span>___________________/ М. А. Голубев</span>
              <br />
              <span>М.П.</span>
            </div>
          </div>
          <div>
            <h3>Клиент:</h3>

            <p>
              Ф.И.О. {orderData.last_name} {orderData.first_name}{" "}
              {orderData.middle_name || ""}
            </p>

            <p>
              Паспорт Серия <strong>{orderData.passport_series}</strong> №{" "}
              <strong>{orderData.passport_number}</strong>,
            </p>
            <p>Дата Выдачи: {orderData.issue_date}</p>
            <p>Кем Выдан: {orderData.issued_by}</p>
            <p>Адрес регистрации: {orderData.registration_address}</p>
            <div style={{ marginTop: "20px" }}>
              <span>Подпись: _______________/_________________</span>
            </div>
          </div>
        </section>

        {/* Акт приема-передачи */}
        <section className={styles.aktSection}>
          <h2 className={styles.aktTitle}>
            АКТ ПРИЕМА-ПЕРЕДАЧИ ИМУЩЕСТВА В ПРОКАТ
          </h2>
          <p>
            1. Во исполнение условий Договора № {orderData.order_number} от «
            {hours}» {formattedDate}, Пункт проката передал, а Клиент принял во
            временное владение и пользование следующее Имущество:
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№ п/п</th>
                <th>Наименование</th>
                <th>Стоимость имущества, руб.</th>
                <th>Инв. номер</th>
                <th>Заводской номер</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.purchase_price}</td>
                  <td>{item.article}</td>
                  <td>{item.serial_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            2. Имущество передается в исправности и комплектности.
            Работоспособность проверена в присутствии Клиента.
          </p>
          <p>
            3. Клиент обязуется оплатить неисправности якоря, статора,
            двигателя, редуктора и иных повреждений в соответствии с п.4.2.2
            Договора.
          </p>
          <div className={styles.flexBetween} style={{ marginTop: "30px" }}>
            <span>
              Клиент: ____________ / {orderData.last_name}{" "}
              {orderData.first_name?.[0]}.
            </span>
            <span>Пункт проката: ____________ / М. А. Голубев</span>
          </div>
        </section>
      </article>
    </div>
  );
};

RentalContract.displayName = "RentalContract";

export default RentalContract;
