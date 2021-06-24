ActiveRecord::Schema.define(:version => 17) do

  create_table "categories", :force => true do |t|
    t.string   "name"
    t.string   "title"
    t.integer  "parent_id"
    t.string   "query"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comments", :force => true do |t|
    t.text     "content"
    t.string   "byline"
    t.integer  "user_id"
    t.integer  "item_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :force => true do |t|
    t.string   "title"
    t.string   "url"
    t.text     "content"
    t.text     "metadata"
    t.string   "name"
    t.text     "tags",               :limit => 255
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "byline"
    t.integer  "comments_count",                    :default => 0
    t.integer  "stars_count",                       :default => 0
    t.integer  "spam_reports_count",                :default => 0
  end

  create_table "open_id_authentication_associations", :force => true do |t|
    t.binary  "server_url"
    t.string  "handle"
    t.binary  "secret"
    t.integer "issued"
    t.integer "lifetime"
    t.string  "assoc_type"
  end

  create_table "open_id_authentication_nonces", :force => true do |t|
    t.string  "nonce"
    t.integer "created"
  end

  create_table "open_id_authentication_settings", :force => true do |t|
    t.string "setting"
    t.binary "value"
  end

  create_table "spam_reports", :force => true do |t|
    t.integer  "item_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stars", :force => true do |t|
    t.integer "user_id"
    t.integer "item_id"
  end

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "email"
    t.string   "fullname"
    t.string   "url"
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.datetime "remember_token_expires_at"
    t.integer  "admin",                                   :default => 0
    t.string   "identity_url"
    t.integer  "approved_for_feed",                       :default => 0
    t.datetime "last_checked_at"
  end

end
