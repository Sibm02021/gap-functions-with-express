exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
            table.increments('id');
            table.text('spotify_user_id').primary();
            table.text('email').notNullable();
            table.text('account_name').notNullable();
        })
        .createTable('shared_playlists', table => {
            table.increments('id').primary();
            table.text('spotify_playlist_id').notNullable();
            table.text('owner_id').references('spotify_user_id').inTable('users').notNullable();
            table.text('playlist_name').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
            table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
            table.unique(['spotify_playlist_id', 'owner_id']);
        })
        .createTable('wandered_playlists', table => {
            table.increments('id').primary();
            table.integer('playlist_id').references('id').inTable('shared_playlists');
            table.text('recommended_to').references('spotify_user_id').inTable('users');
            table.timestamp('recommended_at', { useTz: true }).defaultTo(knex.fn.now());
            table.boolean('has_viewed').defaultTo(false);
            table.unique(['playlist_id', 'recommended_to']);
        })
        .alterTable('shared_playlists', table => {
            table.index('owner_id', 'idx_shared_playlists_owner');
        })
        .alterTable('wandered_playlists', table => {
            table.index('recommended_to', 'idx_wandered_playlists_user');
        });
};

exports.down = function(knex) {
    return knex.schema
        .raw('DROP INDEX IF EXISTS idx_wandered_playlists_user')
        .raw('DROP INDEX IF EXISTS idx_shared_playlists_owner')
        .dropTableIfExists('wandered_playlists')
        .dropTableIfExists('shared_playlists')
        .dropTableIfExists('users');
};