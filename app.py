from flask import Flask, request, jsonify, render_template
from pytube import Search

app = Flask(__name__)

# Predefined lists of artists
artists = {
    'sad_hindi': [
        'Arijit Singh', 
        'Jubin Nautiyal', 
        'Atif Aslam',
        'Shreya Ghoshal',
        'Armaan Malik',
        'Shashaa Tirupati'
    ],

    'energetic_hindi': [
        'Honey Singh', 
        'Badshah', 
        'Mika Singh', 
        'Diljit Dosanjh', 
        'Neha Kakkar'
    ],
    'party_hindi': [
        'Badshah', 
        'Neha Kakkar', 
        'Guru Randhawa', 
        'Mika Singh', 
        'Honey Singh'
    ],
    'romantic_hindi': [
        'Arijit Singh', 
        'Atif Aslam', 
        'Shreya Ghoshal', 
        'Sonu Nigam', 
        'Sunidhi Chauhan'
    ],
    'rap_hindi': [
        'Raftaar', 
        'Divine', 
        'Emiway Bantai', 
        'Badshah', 
        'Honey Singh'
    ],
    'bhajan_hindi': [
        "bhajan",
        'hanuman bhajans',
        'ram bhajan',
        'vishnu bhajan',
        'bhajan songs',
        'Sonia arora',
        'Anup Jalota',
        'Shuba Mudgal',
        'Vani Jayram',

        'Anuradha',
        'Hari Om Sharan',
        'Shankar Mahadevan',
        'Sadhana Sargam',
        'Sharma bandhus',
        'Jagjit Singh'
            ],
    'energetic_english': [
        'AJR', 
        'Imagine Dragons', 
        'Linkin Park'
    ],
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getRecommendations', methods=['POST'])
def get_recommendations():
    data = request.json
    mood = data['mood']
    language = data['language']
    next_page = data.get('next_page', 1)
    exclude = data.get('exclude', [])

    key = f"{mood}_{language}"
    if key not in artists:
        return jsonify([])  # No predefined artists for this combination

    artist_list = artists[key]
    videos = []

    for artist in artist_list:
        search_query = f"{artist} top songs"
        search = Search(search_query)
        for result in search.results:
            try:
                if key == 'bhajan_hindi':
                    if result.length >= 180 and result.length <= 900 and result.views >= 2000000:
                        if result.title not in exclude:
                            videos.append({
                                'title': result.title,
                                'link': result.watch_url,
                                'views': result.views
                            })
                else:
                    if result.length >= 120 and result.length <= 360 and result.views >= 4000000:
                        if result.title not in exclude:
                            videos.append({
                                'title': result.title,
                                'link': result.watch_url,
                                'views': result.views
                            })
            except Exception as e:
                print(f"Error processing video URL {result.watch_url}: {e}")

    sorted_videos = sorted(videos, key=lambda x: x['views'], reverse=True)
    paginated_videos = sorted_videos[(next_page - 1) * 200:next_page * 200]

    return jsonify(paginated_videos)

if __name__ == '__main__':
    app.run(debug=True)
