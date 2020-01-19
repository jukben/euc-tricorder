#include <pebble.h>

#define KEY_BUTTON_UP 0
#define KEY_BUTTON_DOWN 1

#define KEY_SPEED 0

static Window *s_main_window;
static TextLayer *s_output_layer;
static TextLayer *s_speed_layer;

int _speed = 0;
int speed = 0;
char charSpeed[3] = "";

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
  text_layer_set_text(s_output_layer, "Press up or down.");
}

static void outbox_failed_handler(DictionaryIterator *iter, AppMessageResult reason, void *context)
{
  text_layer_set_text(s_output_layer, "Send failed!");
  APP_LOG(APP_LOG_LEVEL_ERROR, "Fail reason: %d", (int)reason);
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context)
{
  text_layer_set_text(s_output_layer, "Up");

  send(KEY_BUTTON_UP, 0);
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context)
{
  text_layer_set_text(s_output_layer, "Down");

  send(KEY_BUTTON_DOWN, 0);
}

static void click_config_provider(void *context)
{
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}

static void main_window_load(Window *window)
{
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_output_layer = text_layer_create(grect_inset(bounds, GEdgeInsets(0, 0)));
  text_layer_set_text(s_output_layer, "Press up or down.");
  text_layer_set_text_alignment(s_output_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_output_layer));

  s_speed_layer = text_layer_create(grect_inset(bounds, GEdgeInsets((bounds.size.h - 60) / 2, 0)));
  text_layer_set_text(s_speed_layer, "00");
  text_layer_set_font(s_speed_layer, fonts_get_system_font(FONT_KEY_LECO_42_NUMBERS));
  text_layer_set_text_alignment(s_speed_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_speed_layer));
}

static void main_window_unload(Window *window)
{
  text_layer_destroy(s_output_layer);
  text_layer_destroy(s_speed_layer);
}

static void inbox_received_handler(DictionaryIterator *iter, void *context)
{
  Tuple *speed_tuple = dict_find(iter, KEY_SPEED);
  if (speed_tuple)
  {
    speed = speed_tuple->value->int32;
    snprintf(charSpeed, 3, "%02d", speed);

    text_layer_set_text(s_speed_layer, charSpeed);

    // Go back to low-power mode
    app_comm_set_sniff_interval(SNIFF_INTERVAL_NORMAL);
  }
}

static void init(void)
{
  s_main_window = window_create();
  window_set_click_config_provider(s_main_window, click_config_provider);
  window_set_window_handlers(s_main_window, (WindowHandlers){
                                                .load = main_window_load,
                                                .unload = main_window_unload,
                                            });
  window_stack_push(s_main_window, true);

  // Open AppMessage
  app_message_register_outbox_sent(outbox_sent_handler);
  app_message_register_outbox_failed(outbox_failed_handler);
  app_message_register_inbox_received(inbox_received_handler);

  const int inbox_size = 128;
  const int outbox_size = 128;
  app_message_open(inbox_size, outbox_size);
}

static void deinit(void)
{
  window_destroy(s_main_window);
}

int main(void)
{
  init();
  app_event_loop();
  deinit();
}
