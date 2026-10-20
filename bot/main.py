
import asyncio
import logging
import os

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    KeyboardButton,
    Message,
    ReplyKeyboardMarkup,
    WebAppInfo,
)
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()
WEBAPP_URL = os.getenv("WEBAPP_URL", "").strip()

logging.basicConfig(level=logging.INFO)


def validate_config() -> None:
    if not BOT_TOKEN:
        raise RuntimeError("Не задан BOT_TOKEN в файле .env")

    if not WEBAPP_URL.startswith("https://"):
        raise RuntimeError(
            "WEBAPP_URL должен содержать HTTPS-ссылку на GitHub Pages"
        )


dp = Dispatcher()


@dp.message(CommandStart())
async def start(message: Message) -> None:
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🧮 Открыть CalcBite",
                    web_app=WebAppInfo(url=WEBAPP_URL),
                )
            ]
        ],
        resize_keyboard=True,
        is_persistent=True,
    )

    await message.answer(
        "CalcBite - калькулятор КБЖУ.\n\n"
        "Введи значения на 100 г и вес порции. "
        "Остальное посчитается автоматически.",
        reply_markup=keyboard,
    )


async def main() -> None:
    validate_config()

    bot = Bot(token=BOT_TOKEN)

    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


if __name__ == "__main__":
    asyncio.run(main())
