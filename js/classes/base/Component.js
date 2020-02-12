class Component {
  static tact = 21; // кол-во тактов анимации для всех компонентов канваса
  static frameTime = 1000 / FRAMES / Component.tact; // задержка перед
  // следующим тактом
  constructor() {
    this.borderColor = "#4e4e4e";
    this.fillColor = "#f0f0f0"

    this.width = null;
    this.height = null;

    this.x = null;
    this.y = null;

    this.lastX = null;
    this.lastY = null;
  }

  isHadPoint(x, y) {
    return (
      x >= this.x && x <= this.x + this.width &&
      y >= this.y && y <= this.y + this.height
    )
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   *  Функция плавно перемещает компонент, не регулируя isConnecting, smoothing
   *  Требуется их явно поменять, т.к. это не будет правильно работать в случае
   *  передвижения группы фрагментов по одному (smoothing должен ставиться не
   *  каждому фрагменту в отдельности, а объекту группы)
   *
   *  @param int newX - новая координата x
   *
   *  @param int newY - новая координата y
   *
   *  @param function endFunction - функция, которая должна сработать по
   *                                завершению анимации
   *
   */
  smoothMove(newX, newY, endFunction = function() {}) {
    let oldX = this.x;
    let oldY = this.y;
    let currentTact = 0;
    let dX = (newX - oldX) / (Component.tact);
    let dY = (newY - oldY) / (Component.tact);
    let component = this;

    // рекурсивная функция вызываемая с задержкой в самой себе
    function reDraw() {
      component.x += dX;
      component.y += dY;

      if (currentTact < Component.tact - 1) {
        setTimeout(reDraw, Component.frameTime);
        currentTact++;
      } else {
        component.x = newX;
        component.y = newY;
        endFunction();
      }
    }
    reDraw();
  }

  /**
   * Функция для плавного изменения размера у компонента
   * Не меняет значения resizing
   *
   * @param double - 4 длины компонента, понятные из их названий
   *
   * @param back - стоит ли повторять анимацию задонаперед при истинности
   *
   */
  smoothResize(old_width, old_height, new_width, new_height, back = false) {
    let currentTact = 0;
    let dX = (new_width - old_width) / (Component.tact);
    let dY = (new_height - old_height) / (Component.tact);

    var current_width = old_width;
    var current_height = old_height;

    let component = this;

    // рекурсивная функция вызываемая с задержкой в самой себе
    function resize() {
      current_width += dX;
      current_height += dY;
      component.setSizes(component, current_width, current_height);

      if (currentTact < Component.tact - 1) {
        setTimeout(resize, Component.frame_time);
        currentTact++;
      } else {
        component.setSizes(component, new_width, new_height);
        if (back) {
          // повторная анимация, возвращающая всё обратно
          component.smoothResize(new_width, new_height, old_width, old_height, false, append_cursor);
        }
      }
    }

    resize();
  }

  /**
   * Функция предназначена для мгновенного изменения размера
   * Следует вызывать из smoothResize
   *
   * @param component - компонент, над которым выполняются действия
   *
   * @param current_width - текущая длина компонента
   *
   * @param current_height - текущая высота компонента
   *
   */
  setSizes(component, current_width, current_height) {
    component.current_width = current_width;
    component.current_height = current_height;
  }


  draw(context) {
    context.beginPath();
    context.rect(
      this.x,
      this.y,
      this.width,
      this.height
    );

    context.strokeStyle = this.borderColor;
    context.stroke();
    context.fillStyle = this.fillColor;
    context.fill();
  }
}
