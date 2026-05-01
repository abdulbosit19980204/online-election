import os
import django
import uuid
import random
import sys
from datetime import datetime, timedelta
from django.utils import timezone

# Loyiha ildiz papkasini sys.path ga qo'shish
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Django muhitini sozlash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.elections.models import Election, Candidate

def seed_data():
    print("--- Eski ma'lumotlar tozalanmoqda... ---")
    Candidate.objects.all().delete()
    Election.objects.all().delete()

    election_titles = [
        "Prezidentlik Saylovi 2026",
        "Oliy Majlis Qonunchilik palatasi saylovi",
        "Toshkent shahri hokimi saylovi",
        "Mahalla raisi saylovi - 'Yangi Hayot' mahallasi",
        "Universitet talabalar kengashi raisi",
        "Yilning eng yaxshi innovatori tanlovi",
        "Ekologiya qo'mitasi rahbari saylovi",
        "IT-Park direktorlar kengashi saylovi",
        "Yoshlar Ittifoqi yetakchisi saylovi",
        "Milliy Olimpiya Qo'mitasi raisi saylovi"
    ]

    uzb_names = [
        "Alisher Usmonov", "Sardor Karimov", "Jasur Abduvaliyev", "Madina Axmedova",
        "Sitora Shukurova", "Baxtiyor Nurmatov", "Rustam Qosimov", "Ziyoda Orifova",
        "Otabek Jo'rayev", "Farrux Xayrullayev", "Dilshod To'rayev", "Nigora Umarova",
        "Azizbek Sodiqov", "Shaxnoza Ergasheva", "Bobur Mansurov"
    ]

    parties = [
        "Adolat SDP", "O'zLiDeP", "Milliy Tiklanish DP", "Xalq Demokratik Partiyasi",
        "O'zbekiston Ekologik partiyasi", "Mustaqil nomzod"
    ]

    descriptions = [
        "<p>Ushbu saylov yurtimiz kelajagi uchun muhim qadamdir. O'z ovozingiz bilan kelajakni belgilang.</p>",
        "<p>Demokratik islohotlarni qo'llab-quvvatlash va xalq farovonligini oshirish maqsadida o'tkazilayotgan saylov.</p>",
        "<p>Shaffof va adolatli saylov tizimi orqali eng munosib nomzodni tanlang.</p>"
    ]

    bios = [
        "<p>Ko'p yillik tajribaga ega rahbar. Iqtisodiyot sohasida katta yutuqlarga erishgan.</p>",
        "<p>Yoshlar yetakchisi, innovatsion g'oyalar muallifi va jamoat faoli.</p>",
        "<p>Ta'lim tizimini rivojlantirish va ijtimoiy himoyani kuchaytirish tarafdori.</p>"
    ]

    print(f"--- {len(election_titles)} ta saylov yaratilmoqda... ---")

    for i, title in enumerate(election_titles):
        start = timezone.now() - timedelta(days=random.randint(1, 5))
        end = timezone.now() + timedelta(days=random.randint(5, 15))
        
        status = 'active'
        if i > 7: status = 'ended'
        if i == 0: status = 'active' # Always one active

        election = Election.objects.create(
            title=title,
            description=random.choice(descriptions),
            start_time=start,
            end_time=end,
            status=status,
            results_public=True
        )

        # Har bir saylovga 3-5 tadan nomzod qo'shish
        num_candidates = random.randint(3, 5)
        available_names = uzb_names.copy()
        random.shuffle(available_names)

        for j in range(num_candidates):
            Candidate.objects.create(
                election=election,
                name=available_names[j],
                party=random.choice(parties),
                bio=random.choice(bios),
                photo_url=f"https://i.pravatar.cc/150?u={uuid.uuid4()}" # Random avatar
            )
        
        print(f"OK: {title} ({num_candidates} nomzod)")

    print("\nBarcha demo ma'lumotlar muvaffaqiyatli yuklandi!")

if __name__ == "__main__":
    seed_data()
