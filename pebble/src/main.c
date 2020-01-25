#include <pebble.h>

// Outcome message keys
#define OUTBOX_KEY_READY 0
#define OUTBOX_KEY_BUTTON_UP 1
#define OUTBOX_KEY_BUTTON_DOWN 2

// Income message keys
#define INBOX_RECEIVE_KEY_SPEED 0
#define INBOX_RECEIVE_KEY_TEMPERATURE 1
#define INBOX_RECEIVE_KEY_VOLTAGE 2
#define INBOX_RECEIVE_KEY_BATTERY 3
#define INBOX_RECEIVE_KEY_CONNECTED_TO_DEVICE 4
#define INBOX_RECEIVE_KEY_CONNECTED_TO_PHONE 5

static Window *s_main_window;

static Layer *s_main_layer = NULL;

bool _connectedToPhone = false;
bool _connectedToDevice = false;

char _speedBuffer[] = "00";
char _temperatureBuffer[] = "0°C";
char _batteryBuffer[] = "0%";
char _voltageBuffer[] = "0V";
char _timeBuffer[] = "00:00";

static void handle_minute_tick(struct tm *tick_time, TimeUnits units_changed)
{
  layer_mark_dirty(s_main_layer);
}

static void connection_handler(bool connected)
{
  APP_LOG(APP_LOG_LEVEL_INFO, "PebbleKit %sconnected", connected ? "" : "dis");
  _connectedToPhone = connected;
  layer_mark_dirty(s_main_layer);
}

static void send(int key, int value)
{
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);

  dict_write_int(iter, key, &value, sizeof(int), true);

  app_message_outbox_send();
}

static void outbox_sent_handler(DictionaryIterator *iter, void *context)
{
  // Ready for next command
}

static void outbox_failed_handler(DictionaryIterator *iter, AppMessageResult reason, void *context)
{
  APP_LOG(APP_LOG_LEVEL_ERROR, "Fail reason: %d", (int)reason);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context)
{
  APP_LOG(APP_LOG_LEVEL_INFO, "Up presed");
  send(OUTBOX_KEY_BUTTON_UP, 0);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context)
{
  APP_LOG(APP_LOG_LEVEL_INFO, "Down presed");
  send(OUTBOX_KEY_BUTTON_DOWN, 0);
}

static void click_config_provider(void *context)
{
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}

static void main_layer_update_proc(Layer *layer, GContext *ctx)
{
  GRect bounds = layer_get_bounds(layer);

  // time
  clock_copy_time_string(_timeBuffer, sizeof(_timeBuffer));
  graphics_draw_text(ctx, _timeBuffer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD),
                     GRect(0, 0, bounds.size.w, 28), GTextOverflowModeFill, GTextAlignmentCenter, NULL);

  // speed
  graphics_draw_text(ctx, _speedBuffer, fonts_get_system_font(FONT_KEY_LECO_42_NUMBERS),
                     GRect(0, (bounds.size.h - 60) / 2, bounds.size.w, 60), GTextOverflowModeFill, GTextAlignmentCenter, NULL);

  // information (batter, voltage, temperature)
  char information[20];
  snprintf(information, sizeof information, "%s   %s   %s", _batteryBuffer, _voltageBuffer, _temperatureBuffer);

  graphics_draw_text(ctx, information, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD),
                     GRect(0, (bounds.size.h - 60) / 2 + 70, bounds.size.w, 60), GTextOverflowModeFill, GTextAlignmentCenter, NULL);

  // draw connection indicator
  if (_connectedToDevice)
  {
    graphics_context_set_fill_color(ctx, GColorGreen);
  }
  else if (_connectedToPhone)
  {
    graphics_context_set_fill_color(ctx, GColorYellow);
  }
  else
  {
    graphics_context_set_fill_color(ctx, GColorRed);
  }

  graphics_fill_circle(ctx, GPoint(10, bounds.size.h - 10), 5);
}

static void main_window_load(Window *window)
{
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_main_layer = layer_create(bounds);
  layer_set_update_proc(s_main_layer, main_layer_update_proc);
  layer_add_child(window_layer, s_main_layer);

  //Register with TickTimerService
  tick_timer_service_subscribe(MINUTE_UNIT, handle_minute_tick);
  //Register PebbleKitConnection
  connection_service_subscribe((ConnectionHandlers){
      .pebblekit_connection_handler = connection_handler});

  _connectedToPhone = connection_service_peek_pebblekit_connection();
}

static void main_window_unload(Window *window)
{
  layer_destroy(s_main_layer);
  tick_timer_service_unsubscribe();
  connection_service_unsubscribe();
}

static void inbox_received_handler(DictionaryIterator *iter, void *context)
{
  Tuple *speed_tuple = dict_find(iter, INBOX_RECEIVE_KEY_SPEED);
  Tuple *battery_tuple = dict_find(iter, INBOX_RECEIVE_KEY_BATTERY);
  Tuple *temperature_tuple = dict_find(iter, INBOX_RECEIVE_KEY_TEMPERATURE);
  Tuple *voltage_tuple = dict_find(iter, INBOX_RECEIVE_KEY_VOLTAGE);
  Tuple *connected_to_device_tuple = dict_find(iter, INBOX_RECEIVE_KEY_CONNECTED_TO_DEVICE);
  Tuple *connected_to_phone_tuple = dict_find(iter, INBOX_RECEIVE_KEY_CONNECTED_TO_PHONE);

  if (speed_tuple)
  {
    int speed = speed_tuple->value->int32;
    snprintf(_speedBuffer, 3, "%02d", speed);
  }

  if (battery_tuple)
  {
    int battery = battery_tuple->value->int32;
    snprintf(_batteryBuffer, 3, "%02d%%", battery);
  }

  if (temperature_tuple)
  {
    int temperature = temperature_tuple->value->int32;
    snprintf(_temperatureBuffer, 3, "%02d°C", temperature);
  }

  if (voltage_tuple)
  {
    int voltage = voltage_tuple->value->int32;
    snprintf(_voltageBuffer, 3, "%02dV", voltage);
  }

  if (connected_to_device_tuple)
  {
    _connectedToDevice = connected_to_device_tuple->value->uint8 != 0;
  }

  if (connected_to_phone_tuple)
  {
    _connectedToPhone = connected_to_phone_tuple->value->uint8 != 0;
  }

  layer_mark_dirty(s_main_layer);
}

static void init(void)
{
  s_main_window = window_create();
  window_set_background_color(s_main_window, GColorBlack);
  window_set_click_config_provider(s_main_window, click_config_provider);
  window_set_window_handlers(s_main_window, (WindowHandlers){
                                                .load = main_window_load,
                                                .unload = main_window_unload,
                                            });
  window_stack_push(s_main_window, true);

  app_comm_set_sniff_interval(SNIFF_INTERVAL_NORMAL);

  // Open AppMessage
  app_message_register_outbox_sent(outbox_sent_handler);
  app_message_register_outbox_failed(outbox_failed_handler);
  app_message_register_inbox_received(inbox_received_handler);

  const int inbox_size = 128;
  const int outbox_size = 128;
  app_message_open(inbox_size, outbox_size);

  send(OUTBOX_KEY_READY, 1);
}

static void deinit(void)
{
  send(OUTBOX_KEY_READY, 0);
  window_destroy(s_main_window);
}

int main(void)
{
  init();
  app_event_loop();
  deinit();
}
