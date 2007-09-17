		
		<h2 class="sub">Your Search Results</h2>

		<?php while ($wordpress->have_posts()) : $wordpress->the_post();  ?>

			<div class="post" id="post-<?php the_ID(); ?>">
				<h2><a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title(); ?>"><?php the_title(); ?></a></h2>
				<small><?php the_time('F jS, Y') ?> by <?php the_author() ?></small>

				<div class="entry">
					<?php the_excerpt() ?>
				</div>
				
				<p class="postmetadata">Posted in <?php the_category(', ') ?> | <?php edit_post_link('Edit', '', ' | '); ?>  <?php comments_popup_link('No Comments &#187;', '1 Comment &#187;', '% Comments &#187;'); ?></p>
				
			</div>

		<?php endwhile; ?>

		<div class="navigation">
			<div class="alignleft"><?php next_posts_link('&laquo; Older Results') ?></div>
			<div class="alignright"><?php previous_posts_link('Newer Results &raquo;') ?></div>
		</div>